<template>
  <div class="son-reply-single-comment" @click.stop="emitReply">
    <div>
      <a :href="sonReply.ownerHomepage">
        <van-image
          width="30px"
          height="30px"
          fit="cover"
          radius="5px"
          :src="sonReply.ownerAvatar"
        />
      </a>
    </div>
    <div style="flex-grow: 1;margin-left: 8px;margin-right: 8px">
      <div>
        <span class="son-reply-comment-nickname">{{ sonReply.ownerNickname }}&nbsp;<van-icon name="play"/>&nbsp;{{ sonReply.replyObjectNickname }}</span>
      </div>
      <div>
        <span class="son-reply-comment-content">{{sonReply.content}}</span>
      </div>
      <div class="son-reply-comment-media">
        <div style="margin-right: 5px;margin-top: 3px" v-for="img in sonReply.media" :key="img">
          <van-image
            width="20vw"
            height="20vw"
            fit="cover"
            radius="5px"
            :src="img"
          />
        </div>
      </div>
      <div class="son-reply-comment-footer">
        <div>
          <span class="son-reply-comment-create-time">{{sonReply.createTime}}</span>
        </div>
        <div class="son-reply-comment-footer-icon">
          <div @click.stop="createLikes">
            <van-icon name="good-job-o" />
            <span class="son-reply-icon-number" >{{ sonReply.loveUserNumber }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'son-reply',
  watch: {
    sonReplyVal: {
      handler (val, oldVal) {
        this.sonReply = val
      },
      deep: true
    }
  },
  props: ['sonReplyVal'],
  data () {
    return {
      show: false,
      sonReply: this.sonReplyVal
    }
  },
  created () {
  },
  methods: {
    emitReply () {
      this.$emit('changeReplyInfo', this.sonReply)
    },
    createLikes () {
      console.log('like')
    }
  }
}
</script>

<style lang="less" scoped>

.son-reply-single-comment {
  display: flex;
  background-color: #ebedf0;
  padding: 10px 10px 10px 0;

  .son-reply-comment-nickname {
    font-size: 0.75rem;
    color: #969799;
    position: relative;
    bottom: 5px;
  }

  .son-reply-comment-content {
    font-size: 0.9rem;
  }

  .son-reply-comment-media {
    display: flex;
    flex-wrap: wrap;
  }
}

.son-reply-like-style {
  color: orange;
}

.son-reply-comment-footer {
  display: flex;

  .son-reply-comment-create-time {
    color: #969799;
    font-size: 0.75rem;
  }

  .son-reply-comment-footer-icon {
    display: flex;
    margin-left: 80px;
    flex-grow: 1;
    justify-content: space-evenly;
    color: #969799;
  }

  .son-reply-icon-number {
    color: #969799;
    font-size: 0.75rem;
    margin-left: 5px;
  }
}
</style>
