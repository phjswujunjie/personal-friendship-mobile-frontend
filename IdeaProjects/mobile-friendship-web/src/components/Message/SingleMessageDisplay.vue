<!--  聊天信息展示组件 -->
<template>
  <li style="margin-bottom: 3vw">
     <van-image
       width="10vw"
       height="10vw"
       :src="message.avatar"
       radius="5px"
       :class="{'avatar-display-left': directionMark, 'avatar-display-right': !directionMark}"
     />
     <div :class="{'float-right':!directionMark, 'float-left':directionMark}">
       <div v-if="showNickname" :class="{'display-nickname-left': directionMark, 'display-nickname-right': !directionMark}" >{{message.nickname}}</div>
       <div :class="{'message-display-left-div': directionMark, 'message-display-right-div': !directionMark}" v-html="message.content"></div>
       <div style="clear:both;"></div>
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
    messageVal: {
      required: true
    },
    showNickname: {
      default: false
    }
  },
  data () {
    return {
      directionMark: this.directionMarkVal,
      message: this.messageVal
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
  font-size: 1rem;
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
  float: left;
}

.message-display-right-div{
  .message-display-div();
  margin-right: 2vw;
  background-color: #42b983;
  float: right;
}

.display-nickname {
  font-size: 0.75rem;
  color: #969799;
}

.display-nickname-right {
  .display-nickname();
  margin-right: 5px;
  text-align: right;
}

.display-nickname-left {
  .display-nickname();
  margin-left: 7px;
}

.float-right {
  float: right;
}

.float-left {
  float: left;
}
</style>
