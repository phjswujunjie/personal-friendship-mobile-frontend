<template>
  <div v-if="blog" style="display: flex;flex-direction: column;height: 100vh">
    <div>
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        title="评论"
      />
    </div>
    <div style="flex-grow: 1;overflow: auto" @click="showEmojiFlag = -1">
      <van-pull-refresh :disabled="disabled" v-model="isLoading" @refresh="onRefresh" style="height: 100%;overflow: auto">
          <div id="blog">
            <single-blog :show-remove-icon="false" :show-follow-button="true" :blog-val="blog" :show-operate-button="false"/>
          </div>
          <div id="comment">
            <div class="display-comment-header">
              <span @click="show = true">
                <van-icon color="red" name="fire"/>
                <span style="margin: 0 5px">最热评论</span>
                <van-icon name="arrow-down"/>
              </span>
            </div>
            <div>
              <single-comment @close="disabled=false" @open="disabled=true" v-for="comment in comments" :comment-val="comment" :key="comment.commentId"/>
            </div>
          </div>
      </van-pull-refresh>
    </div>
    <div style="display: flex;background-color: white;padding: 1vh">
      <div style="flex-grow: 1;">
        <textarea ref="textArea" @click.stop="showEmojiFlag = -1" v-model="message" placeholder="快来评论吧" class="message-input"></textarea>
      </div>
      <div style="margin-left: 10px;width: 30vw;display: flex;justify-content: space-evenly;">
        <van-icon name="photo-o" size="1.5rem" class="icon-style"/>
        <van-icon name="smile-o" size="1.5rem" @click="clickEmoji" class="icon-style" />
        <van-button type="primary" size="small" style="margin-top: 0.5vh" @click="sendComment">评论</van-button>
      </div>
      </div>
    <div class="emoji-div" v-if="showEmojiFlag === 1">
        <EmojiSelector style="height: 30vh;width: 100vw;" @select="selectEmoji"/>
        <div class="remove-emoji-div" @click="removeEmoji">
          <van-icon name="clear" size="1.5rem" color="lightgray" style="margin-left: 1.75vh;margin-top: 0.75vh"/>
        </div>
    </div>
    <div>
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="关闭"
        close-on-click-action
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
import SingleBlog from '@/components/Blog/SingleBlog.vue'
import Comment from '@/components/Comment/Comment.vue'
import { Toast } from 'vant'

export default {
  name: 'blog-comment',
  components: {
    'single-blog': SingleBlog,
    'single-comment': Comment
  },
  props: ['id'],
  data () {
    return {
      showEmojiFlag: -1,
      comments: null,
      blog: null,
      isLoading: false,
      show: false,
      actions: [{ name: '最热评论' }, { name: '最新评论' }],
      message: '',
      disabled: false
    }
  },
  created () {
    this.getBlogCommentData()
  },
  methods: {
    async sendComment () {
      if (this.message.trim() !== '' && this.blog.loginStatus) {
        const date = new Date()
        const createTime = (date.getFullYear() + '-' + this.adjustSeconds((date.getMonth() + 1)) + '-' + this.adjustSeconds(date.getDate()) + ' ' + this.adjustSeconds(date.getHours()) + ':' + this.adjustSeconds(date.getMinutes()) + ':' + this.adjustSeconds(date.getSeconds()))
        const data = new FormData()
        // 创建Comment对象发给后端存储
        data.append('createTime', createTime)
        data.append('blogOwnerId', this.blog.userId)
        data.append('blogId', this.blog.id)
        data.append('content', this.message)
        data.append('loveUser', '')
        data.append('loveUserNumber', 0)
        data.append('replyNumber', 0)
        data.append('media', '')
        const { data: res } = await this.$http({
          method: 'post',
          url: '/comments',
          data: data,
          headers: {
            token: window.localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        const commentId = res.data.id
        delete res.data.id
        if (res.code === 23001) {
          // 后端返回正确的结果时, 更新页面
          const newComment = {
            avatar: this.blog.selfAvatar,
            nickname: this.blog.selfNickname,
            homepage: this.$homepageLocation + '/u/' + this.blog.selfId,
            isLike: 0,
            loginStatus: true,
            commentId,
            ...res.data
          }
          this.comments.unshift(newComment)
          this.message = ''
          Toast.success('评论成功')
        }
      }
    },
    removeEmoji () {
      // 记录光标的位置
      const start = this.$refs.textArea.selectionStart
      // 记录光标前面的内容
      const beforeContent = this.message.substring(0, start)
      // 记录光标后面的内容
      const afterContent = this.message.substring(start, this.message.length)
      // 利用for...of来统计字符的真正个数
      let index = 0
      /* eslint-disable no-unused-vars */
      for (const i of beforeContent) {
        index++
      }
      /* eslint-enable no-unused-vars */
      let newContent = ''
      // 用来辅助获取到光标前面的内容(剔除了最后一个字符)
      let j = 1
      let len = 0
      for (const i of beforeContent) {
        // 对字符进行拼接
        if (j < index) {
          newContent += i
          j++
        } else {
          // 统计最后删除的字符的长度用来后面设置光标的位置
          len = i.length
        }
      }
      // 合并成新的内容
      this.message = newContent + afterContent
      // 更新后设置光标
      this.$nextTick(() => {
        this.$refs.textArea.setSelectionRange(start - len, start - len)
      })
      // 得到焦点
      this.stopKeyboard()
    },
    selectEmoji (item) {
      // 记录光标的位置
      const start = this.$refs.textArea.selectionStart
      // 将表情插入到文字中
      this.message = (this.message.substring(0, start) + item.char + this.message.substring(start, this.message.length))
      this.stopKeyboard()
      // 等message内容更新完毕后, 将光标设置到所添加的表情的后面
      this.$nextTick(() => {
        this.$refs.textArea.setSelectionRange(start + item.char.length, start + item.char.length)
      })
    },
    // 唤起表情框
    clickEmoji () {
      if (this.showEmojiFlag === 1) {
        // 为1则代表要隐藏表情框, 这时我们唤起移动端的键盘
        this.$refs.textArea.focus()
      } else {
        // 为-1则表示要唤起表情框, 这时我们拒绝唤起移动端的键盘
        this.stopKeyboard() // 这里我们是想拒绝唤起键盘
      }
      this.showEmojiFlag *= -1
    },
    onSelect () {
      console.log(111)
    },
    onRefresh () {
      this.getBlogCommentData()
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
    async getBlogCommentData () {
      const { data: res } = await this.$http.get('/blogs/' + this.id, this.$store.state.headers)
      // 第一个数据为博客的数据
      this.blog = res.data[0]
      res.data.splice(0, 1)
      // 后面的全为回复的数据
      this.comments = res.data
      // 开始处理数据, 将自己的评论始终放在前面
      if (this.blog.loginStatus) {
        const selfComments = []
        const index = []
        let i = 0
        const selfId = Number(this.blog.selfId)
        for (const comment of this.comments) {
          if (Number(comment.ownerId) === selfId) {
            index.unshift(i)
          }
          i++
        }
        for (const j of index) {
          selfComments.push(...this.comments.splice(j, 1))
        }
        this.comments = [...selfComments, ...this.comments]
      }
      console.log(this.blog)
      console.log(this.comments)
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    // 得到光标却又禁止键盘的弹起
    stopKeyboard () {
      this.$refs.textArea.setAttribute('readonly', 'readonly')
      this.$refs.textArea.focus()
      setTimeout(() => {
        this.$refs.textArea.removeAttribute('readonly')
      })
    },
    adjustSeconds: function (seconds) {
      if (seconds < 10) {
        return '0' + seconds
      }
      return seconds
    }
  }
}
</script>

<style lang="less" scoped>
.display-comment-header {
  background-color: white;
  height: 50px;
  margin-top: 10px;
  line-height: 50px;
  font-weight: bolder;
  padding: 0 0 0 15px;
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
}

.icon-style {
  margin-top: 8px;
}

.message-input {
  width: 100%;
  border: none;
  background-color: #ebedf0;
  padding: 2px 0 2px 5px;
  resize: none;
}
.emoji-div {
  height: 30vh;

  .remove-emoji-div {
    width: 7vh;
    height: 5vh;
    background-color: #ebedf0;
    position: fixed;
    bottom: 7px;
    right: 40px;
    border-radius: 5px;
  }
}

/deep/ .emoji-panel {
  display: flex;
  flex-direction: column;
  background-color: #ebedf0;
}

/deep/ .emoji-box {
  flex-grow: 1;
  overflow: auto;
}

/deep/ .emoji-footer {
  height: 5vh;
  position: relative;
}
</style>
