<template>
  <div>
   <div>
     <van-nav-bar
       :title="toNickname"
       left-text="返回"
       right-text="按钮"
       left-arrow
       @click-left="onClickLeft"
       @click-right="onClickRight"
       style="position: fixed;top: 0;right: 0;left: 0"
     />
   </div>
   <div>
     <ul style="overflow: auto;height: 100vh;" ref="messageUl">
       <li style="margin-top: 60px"></li>
       <SingleMessageDisplay :key="message.id" :content-val="message.content" :avatar-val="message.avatar"
                             :direction-mark-val="Number(message.toId) !== Number($route.params.id)" v-for="message in chatMessages"/>
       <li style="margin-bottom: 8vh" ref="lastMessage"></li>
     </ul>
   </div>
   <div style="position: fixed;bottom: 0;left: 0;right: 0">
     <van-search
       v-model="message"
       placeholder="请输入内容"
       @search="sendMessage"
       left-icon=""
       :show-action="true"
       ref="text"
     >
       <template #action>
         <van-button type="primary" @click="sendMessage">发送</van-button>
       </template>
     </van-search>
   </div>
  </div>
</template>

<script>
import SingleMessageDisplay from '@/components/Message/SingleMessageDisplay'

export default {
  name: 'chat-with-other',
  components: {
    SingleMessageDisplay
  },
  data () {
    return {
      // 聊天对象的昵称
      toNickname: null,
      // 所有的聊天信息
      chatMessages: null,
      // 自己的头像地址
      selfAvatar: null,
      // 要进行发送的信息
      message: '',
      // 本人的id
      selfId: null,
      messageSocket: null
    }
  },
  created () {
    this.getBeforeMessage()
  },
  methods: {
    async getBeforeMessage () {
      // 得到与聊天对象的所有聊天信息
      const { data: res } = await this.$http.get('/chatMessages/' + this.$route.params.id, this.$store.state.headers)
      console.log(res)
      if (res.code === 20001) {
        // 设置自己的头像地址
        this.selfAvatar = res.data[0].selfAvatar
        // 设置聊天对象的昵称
        this.toNickname = res.data[0].toNickname
        // 得到自己的id
        this.selfId = res.data[0].selfId
        this.messageSocket = new WebSocket(this.$webSocketUrl + '/chatWebSocket')
        this.messageSocket.onopen = () => {
          const data = { userId: this.selfId + '', toId: this.$route.params.id }
          this.messageSocket.send(JSON.stringify(data))
        }
        this.storageOrDisplayMessage()
        // 得到全部的信息
        this.chatMessages = res.data.slice(1, res.data.length)
        console.log(this.chatMessages)
        this.$nextTick(() => {
          this.$refs.messageUl.scrollTop = this.$refs.messageUl.scrollHeight
        })
        // 发送websocket请求不断的得到聊天对象发过来的信息
      } else {
        this.$router.push({ path: '/homepage' })
      }
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    onClickRight () {

    },
    // 处理接收到的信息
    storageOrDisplayMessage () {
      // 接收从服务器传过来的信息
      this.messageSocket.onmessage = res => {
        const message = JSON.parse(res.data)
        // 如果该信息的发送者是聊天的对象, 则在界面中显示信息
        if (Number(message.userId) === Number(this.$route.params.id)) {
          this.chatMessages.push(message)
          this.$nextTick(() => {
            this.$refs.messageUl.scrollTop = this.$refs.messageUl.scrollHeight
          })
        } else {
          // 如果不是的话则将此信息再发送给后端存储为未读信息
          const data = new URLSearchParams()
          data.append('content', message.content)
          data.append('createTime', message.createTime)
          data.append('fromUserAvatar', message.avatar)
          data.append('fromId', message.userId)
          this.$http.post('/chatMessages/storageUnreadMessage', data, this.$store.state.headers)
        }
      }
    },
    // 处理发送信息的函数
    sendMessage () {
      if (this.message.trim() !== '') {
        this.message = this.message.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
        // 点击发送信息时展示出来
        const messageInfo = {
          content: this.message,
          userId: this.selfId + '',
          toId: this.$route.params.id,
          avatar: this.selfAvatar
        }
        this.chatMessages.push(messageInfo)
        this.$nextTick(() => {
          this.$refs.messageUl.scrollTop = this.$refs.messageUl.scrollHeight
        })
        const data = {
          content: this.message,
          userId: this.selfId + '',
          toId: this.$route.params.id
        }
        // 发送信息
        this.messageSocket.send(JSON.stringify(data))
        this.message = ''
        this.$refs.text.focus()
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
