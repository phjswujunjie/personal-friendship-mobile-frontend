<!--  聊天信息展示组件 -->
<template>
  <li style="position: relative; margin-top: 5vw;">
     <van-image
       width="5vh"
       height="5vh"
       :src="avatar"
       radius="5px"
       :class="{'avatar-display-left': directionMark, 'avatar-display-right': !directionMark}"
     />
     <div v-html="content" :class="{'message-display-left-div': directionMark, 'message-display-right-div': !directionMark}">
     </div>
     <div style="clear:both;"></div>
  </li>
</template>

<script>
export default {
  name: 'single-message-display',
  props: {
    // 为true则表示显示在屏幕左边的信息, 为false则为右边的信息(本人发出的信息)
    directionMarkVal: {
      required: true,
      type: Boolean
    },
    avatarVal: {
      required: true,
      type: String
    },
    contentVal: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      directionMark: this.directionMarkVal,
      avatar: this.avatarVal,
      content: this.contentVal
    }
  }
}
</script>

<style scoped lang="less">
.avatar-display-left{
  float: left;
  margin-left: 2vw;
}

.avatar-display-right{
  float: right;
  margin-right: 2vw;
}

.message-display-div {
  font-size: 2vh;
  border-radius: 1vh;
  padding: 7px;
  word-break: break-all;
  max-width: 65vw;
  display: inline-block;
}

.message-display-left-div {
  .message-display-div();
  margin-left: 2vw;
  background-color: white;
}

.message-display-right-div{
  .message-display-div();
  float: right;
  margin-right: 2vw;
  background-color: #42b983;
}
</style>
