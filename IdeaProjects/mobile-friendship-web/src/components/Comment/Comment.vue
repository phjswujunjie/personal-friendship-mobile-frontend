<!--
  一个单个的评论展示组件包括: 评论所有者的头像: avatar, 评论所有者的昵称: nickname, 评论所有者的id: ownerId, 评论所有者的主页地址: homepage,
  评论的id: commentId, 评论的内容: content, 评论的创建时间: createTime
  评论所属博客的id: blogId, 评论所属博客拥有者的id: blogOwnerId,
  登录状态: loginStatus, 如果登陆状态为true, 则有属性isLike(本人是否点赞),
  点赞的人: loveUser, 点赞数量: loveUserNumber, 回复数量: replyNumber
-->
<template>
  <div class="single-comment">
    <div>
      <a :href="comment.homepage">
        <van-image
          width="40px"
          height="40px"
          fit="cover"
          radius="5px"
          :src="comment.avatar"
        />
      </a>
    </div>
    <div style="flex-grow: 1;margin-left: 8px;margin-right: 8px">
      <div>
        <span class="comment-nickname">{{comment.nickname}}</span>
      </div>
      <div>
        <span class="comment-content">{{comment.content}}</span>
      </div>
      <div class="comment-media">
        <div style="margin-right: 5px;margin-top: 3px" v-for="img in comment.image" :key="img">
          <van-image
            width="25vw"
            height="25vw"
            fit="cover"
            radius="5px"
            :src="img"
          />
        </div>
      </div>
      <div class="comment-footer">
        <div>
          <span class="comment-create-time">{{comment.createTime}}</span>
        </div>
        <div class="comment-footer-icon">
          <div>
            <van-icon style="position: relative;top: 3px" name="comment-o"/>
          </div>
          <div>
            <van-icon @click="show = true" style="position: relative;top: 3px" name="comment-o"/>
          </div>
          <div @click="createLikes">
            <van-icon name="good-job-o" :class="{ 'like-style': comment.isLike === 1}"/>
            <span class="icon-number" >{{ comment.loveUserNumber > 0 ? comment.loveUserNumber : ''}}</span>
          </div>
        </div>
      </div>
      <div class="reply-container" @click="show = true" v-if="Number(comment.replyNumber) !== 0 && allReply !== null" >
        <div v-if="Number(allReply.length) >= 1">
          <span class="reply-content"><a :href="allReply[0][0].ownerHomepage" class="reply-user-nickname">{{allReply[0][0].ownerNickname}}</a>&nbsp;:&nbsp;{{allReply[0][0].content}}</span>
        </div>
        <div v-if="Number(allReply.length) >= 2">
          <span class="reply-content"><a :href="allReply[1][1].ownerHomepage" class="reply-user-nickname">{{allReply[1][1].ownerNickname}}</a>&nbsp;:&nbsp;{{allReply[1][1].content}}</span>
        </div>
        <div>
          <span class="reply-user-nickname" v-if="Number(comment.replyNumber) > 2" @click.stop="show = true">查看{{comment.replyNumber}}条评论</span>
        </div>
      </div>
      <div>
        <van-action-sheet @closed="close" @open="open" v-model="show" :title="'回复@' + comment.nickname">
          <div class="content">
           <div style="flex-grow: 1;overflow: auto" @click="showEmojiFlag = -1">
             <reply-comment  @changeReplyInfo="getReplyInfo" :comment-val="comment"/>
             <div style="margin: 10px 0 10px 10px;font-size: 0.9rem"><span>回复:</span></div>
             <reply-com @changeReplyInfo="getReplyInfo" v-for="(reply, index) in allReply" :key="reply[0].id" :reply-val="reply" :index="index"/>
           </div>
            <div class="input-reply">
              <div style="display: flex;background-color: white;padding: 1vh;z-index: 2023">
                <div style="flex-grow: 1;">
                  <textarea @focus="showOverlay = true" ref="replyTextArea" @click.stop="showEmojiFlag = -1" v-model="message" :placeholder="'回复' + tip" class="message-input"></textarea>
                </div>
                <div style="margin-left: 10px;width: 30vw;display: flex;justify-content: space-evenly;">
                  <van-icon name="photo-o" size="1.5rem" class="icon-style"/>
                  <van-icon name="smile-o" size="1.5rem" @click="clickEmoji" class="icon-style" />
                  <van-button type="primary" size="small" style="margin-top: 0.5vh" @click="sendReply">回复</van-button>
                </div>
              </div>
              <div class="emoji-div" v-if="showEmojiFlag === 1">
                <EmojiSelector style="height: 30vh;width: 100vw;" @select="selectEmoji"/>
                <div class="remove-emoji-div" @click="removeEmoji">
                  <van-icon name="clear" size="1.5rem" color="lightgray" style="margin-left: 1.75vh;margin-top: 0.75vh"/>
                </div>
              </div>
            </div>
            <van-overlay :show="showOverlay || showEmojiFlag === 1" @click="hideOperate" />
          </div>
        </van-action-sheet>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import ReplyComment from '@/components/Comment/ReplyComment.vue'
import Reply from '@/components/Reply/ParentReply.vue'

export default {
  name: 'single-comment',
  components: {
    'reply-comment': ReplyComment,
    'reply-com': Reply
  },
  props: ['commentVal'],
  data () {
    return {
      showOverlay: false,
      show: false,
      comment: this.commentVal,
      tip: this.commentVal.nickname,
      message: '',
      showEmojiFlag: -1,
      replyInfo: [this.commentVal, 'comment'],
      allReply: null
    }
  },
  created () {
    this.getReplyData()
  },
  methods: {
    hideOperate () {
      this.showOverlay = false
      this.showEmojiFlag = -1
    },
    // 得到回复对象的信息
    getReplyInfo (val) {
      this.replyInfo = val
      if (val[1] === 'comment') this.tip = val[0].nickname
      else this.tip = val[0].ownerNickname
      this.$refs.replyTextArea.focus()
    },
    // 创建回复
    async sendReply () {
      if (this.comment.loginStatus && this.message.trim() !== '') {
        let replyId = -1
        // 用户回复的类型, 为comment则用户的回复为一级回复, 其它的则为子回复, 子回复根据flag的不同,
        // replyId的取值也不同
        const flag = this.replyInfo[1]
        // 得到回复对象的id
        const replyObjectId = this.replyInfo[0].ownerId
        if (flag === 'parentReply') replyId = this.replyInfo[0].id
        else if (flag === 'sonReply') replyId = this.replyInfo[0].replyId
        const data = {
          content: this.message,
          commentId: this.comment.commentId,
          blogId: this.comment.blogId,
          blogOwnerId: this.comment.blogOwnerId,
          loveUser: '',
          loveUserNumber: 0,
          media: '',
          replyObjectId,
          replyId
        }
        const { data: res } = await this.$http({
          method: 'post',
          url: '/replies',
          data: data,
          headers: {
            token: window.localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (res.code === 23001) {
          if (flag === 'comment') this.allReply.unshift([res.data])
          else this.allReply[Number(this.replyInfo[2])].splice(1, 0, res.data)
          this.$nextTick(() => {
            this.comment.replyNumber++
            Toast.success('回复成功!')
            // 关闭遮罩层
            this.hideOperate()
            this.message = ''
          })
        }
      }
    },
    removeEmoji () {
      // 记录光标的位置
      const start = this.$refs.replyTextArea.selectionStart
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
        this.$refs.replyTextArea.setSelectionRange(start - len, start - len)
      })
      // 得到焦点
      this.stopKeyboard()
    },
    selectEmoji (item) {
      // 记录光标的位置
      const start = this.$refs.replyTextArea.selectionStart
      // 将表情插入到文字中
      this.message = (this.message.substring(0, start) + item.char + this.message.substring(start, this.message.length))
      this.stopKeyboard()
      // 等message内容更新完毕后, 将光标设置到所添加的表情的后面
      this.$nextTick(() => {
        this.$refs.replyTextArea.setSelectionRange(start + item.char.length, start + item.char.length)
      })
    },
    clickEmoji () {
      if (this.showEmojiFlag === 1) {
        // 为1则代表要隐藏表情框, 这时我们唤起移动端的键盘
        this.$refs.replyTextArea.focus()
      } else {
        // 为-1则表示要唤起表情框, 这时我们拒绝唤起移动端的键盘
        this.stopKeyboard() // 这里我们是想拒绝唤起键盘
      }
      this.showEmojiFlag *= -1
    },
    async getReplyData () {
      const { data: res } = await this.$http.get('/replies/' + this.comment.commentId)
      this.allReply = res.data
    },
    createLikes () {
      if (!this.comment.loginStatus) {
        Dialog.alert({
          title: '提示',
          message: '请先进行登录'
        })
        return
      }
      if (this.comment.isLike === 0) {
        // 将此博客的是否点赞设置为1(用户已点赞)
        this.comment.isLike = 1
        // 将此博客的点赞数加1
        this.comment.loveUserNumber++
        Toast.success('点赞成功')
      } else {
        this.comment.isLike = 0
        this.comment.loveUserNumber--
      }
      const data = new URLSearchParams()
      // 博客的id
      data.append('commentId', this.comment.commentId)
      // 进行的操作, 1为增加点赞信息, 0为删除点赞信息
      data.append('flag', this.comment.isLike)
      // 将操作点赞的信息发给后端, 进而对数据库中的点赞信息进行操作
      this.$http.post('/likes/comment', data, this.$store.state.headers)
    },
    close () {
      this.$emit('close', false)
    },
    open () {
      this.$emit('open', true)
    },
    // 得到光标却又禁止键盘的弹起
    stopKeyboard () {
      this.$refs.replyTextArea.setAttribute('readonly', 'readonly')
      this.$refs.replyTextArea.focus()
      setTimeout(() => {
        this.$refs.replyTextArea.removeAttribute('readonly')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.input-reply {
  z-index: 2;

  .remove-emoji-div {
    width: 7vh;
    height: 5vh;
    background-color: #ebedf0;
    position: fixed;
    bottom: 7px;
    right: 40px;
    border-radius: 5px;
  }

  .message-input {
    width: 100%;
    border: none;
    background-color: #ebedf0;
    padding: 2px 0 2px 5px;
    resize: none;
  }

  .icon-style {
    margin-top: 8px;
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

.content {
  height: 80vh;
  background-color: #ebedf0;
  display: flex;
  flex-direction: column;
}

.single-comment {
  display: flex;
  background-color: white;
  padding: 10px;

  .comment-nickname {
    font-size: 0.75rem;
    color: #969799;
    position: relative;
    bottom: 5px;
  }

  .comment-content {
    font-size: 0.9rem;
  }

  .comment-media {
    display: flex;
    flex-wrap: wrap;
  }
}

.like-style {
  color: orange;
}

.comment-footer {
  display: flex;

  .comment-create-time {
    color: #969799;
    font-size: 0.75rem;
  }

  .comment-footer-icon {
    display: flex;
    margin-left: 50px;
    flex-grow: 1;
    justify-content: space-evenly;
    color: #969799;
  }

  .icon-number {
    color: #969799;
    font-size: 0.75rem;
    margin-left: 5px;
  }
}

.reply-container {
  width: 98%;
  background-color: #ebedf0;
  margin-top: 5px;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;

  .reply-content {
    color: #969799;
    font-size: 0.9rem;
  }

  .reply-user-nickname {
    color: cornflowerblue;
    font-size: 0.9rem;
  }
}
</style>
