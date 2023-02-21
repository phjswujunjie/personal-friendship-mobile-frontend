<!--
  一个单个的评论展示组件包括: 评论所有者的头像: avatar, 评论所有者的昵称: nickname, 评论所有者的id: ownerId, 评论所有者的主页地址: homepage,
  评论的id: commentId, 评论的内容: content, 评论的创建时间: createTime
  评论所属博客的id: blogId, 评论所属博客拥有者的id: blogOwnerId,
  登录状态: loginStatus, 如果登陆状态为true, 则有属性isLike(本人是否点赞),
  点赞的人: loveUser, 点赞数量: loveUserNumber, 回复数量: replyNumber
-->
<template>
  <div class="reply-single-comment" @click="emitReply">
    <div>
      <a :href="parentReply.ownerHomepage">
        <van-image
          width="40px"
          height="40px"
          fit="cover"
          radius="5px"
          :src="parentReply.ownerAvatar"
        />
      </a>
    </div>
    <div style="flex-grow: 1;margin-left: 8px;margin-right: 8px">
      <div>
        <span class="reply-comment-nickname">{{parentReply.ownerNickname}}</span>
      </div>
      <div>
        <span class="reply-comment-content">{{parentReply.content}}</span>
      </div>
      <div class="reply-comment-media">
        <div style="margin-right: 5px;margin-top: 3px" :key="img" v-for="img in parentReply.media">
          <van-image
            width="25vw"
            height="25vw"
            fit="cover"
            radius="5px"
            :src="img"
          />
        </div>
      </div>
      <div class="reply-comment-footer">
        <div>
          <span class="reply-comment-create-time">{{parentReply.createTime}}</span>
        </div>
        <div class="reply-comment-footer-icon">
          <div @click.stop="createLikes">
            <van-icon name="good-job-o" />
            <span class="reply-icon-number" >{{parentReply.loveUserNumber}}</span>
          </div>
        </div>
      </div>
      <div>
        <son-reply @changeReplyInfo="emitSonReply" :son-reply-val="sonReply" v-for="(sonReply, index) in allSonReply" :key="sonReply.id" v-show="index > 1 ? showAllSonReply: true"/>
        <div v-if="allSonReply.length > 2" style="margin-top: 5px">
          <div v-if="!showAllSonReply"><span @click.stop="showAllSonReply = true" style="margin-left: 30px;font-size: 0.75rem;color: cornflowerblue">全部{{allSonReply.length}}条回复<van-icon name="arrow-down"/></span></div>
          <div v-else><span @click.stop="showAllSonReply = false" style="margin-left: 30px;font-size: 0.75rem;color: cornflowerblue">收起<van-icon name="arrow-up"/></span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SonReply from '@/components/Reply/SonReply.vue'

export default {
  name: 'single-reply',
  components: {
    'son-reply': SonReply
  },
  watch: {
    replyVal: {
      handler (newVal, oldVal) {
        this.parentReply = newVal[0]
        this.allSonReply = newVal.slice(1, newVal.length)
      },
      deep: true
    }
  },
  props: ['replyVal', 'index'],
  data () {
    return {
      // 展示所有的子回复节点
      showAllSonReply: false,
      show: false,
      parentReply: this.replyVal[0],
      allSonReply: this.replyVal.slice(1, this.replyVal.length)
    }
  },
  created () {
  },
  methods: {
    emitReply () {
      this.$emit('changeReplyInfo', [this.parentReply, 'parentReply', this.index])
    },
    emitSonReply (val) {
      this.$emit('changeReplyInfo', [val, 'sonReply', this.index])
    },
    createLikes () {
      console.log('like')
    }
  }
}
</script>

<style lang="less" scoped>

.reply-single-comment {
  display: flex;
  background-color: #ebedf0;
  padding: 10px;

  .reply-comment-nickname {
    font-size: 0.75rem;
    color: #969799;
    position: relative;
    bottom: 5px;
  }

  .reply-comment-content {
    font-size: 0.9rem;
  }

  .reply-comment-media {
    display: flex;
    flex-wrap: wrap;
  }
}

.reply-like-style {
  color: orange;
}

.reply-comment-footer {
  display: flex;

  .reply-comment-create-time {
    color: #969799;
    font-size: 0.75rem;
  }

  .reply-comment-footer-icon {
    display: flex;
    margin-left: 80px;
    flex-grow: 1;
    justify-content: space-evenly;
    color: #969799;
  }

  .reply-icon-number {
    color: #969799;
    font-size: 0.75rem;
    margin-left: 5px;
  }
}
</style>
