<template>
  <div>
   <div class="single-comment" @click="emitReply">
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
     <div style="flex-grow: 1;margin-left: 8px;margin-top: 15px">
       <span class="comment-nickname">{{comment.nickname}}</span>
     </div>
   </div>
    <div style="padding: 0 10px 10px 10px;background-color: white">
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
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'

export default {
  name: 'reply-comment',
  props: ['commentVal'],
  data () {
    return {
      show: false,
      comment: this.commentVal
    }
  },
  methods: {
    emitReply () {
      this.$emit('changeReplyInfo', [this.comment, 'comment'])
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
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 80vh;
}

.single-comment {
  display: flex;
  background-color: white;
  padding: 10px;

  .comment-nickname {
    font-size: 1rem;
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
