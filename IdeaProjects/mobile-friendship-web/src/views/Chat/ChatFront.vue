<template>
  <div>
    <van-nav-bar
      title="信息"
      style="position: fixed;top: 0;left: 0;right: 0"
    />
    <van-search v-model="value" placeholder="搜索聊天记录"/>
    <div v-if="messageNumber">
      <SingleFriendChatCard :unread-message-val="Number(messageNumber[friend.id]) > 0 ? messageList[friend.id].content : ''"
                            :unread-message-number-val="messageNumber[friend.id]"
                            :nickname-val="friend.nickname"
                            :homepage-location-val="friend.homepageLocation" :avatar-val="friend.avatar"
                            v-for="friend in friendList"
                            :key="friend.id"
      />
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import SingleFriendChatCard from '@/components/FriendChatCard/SingleFriendChatCard'

export default {
  name: 'chat-front',
  components: {
    SingleFriendChatCard
  },
  data () {
    return {
      // 输入的搜索关键词
      value: '',
      // 全部的朋友信息
      friendList: [],
      // 全部的好友id列表, 可以用这个来查询好友是否上线
      friendId: [],
      // 朋友的状态信息
      friendStatus: null,
      // 未读信息的数目
      messageNumber: null,
      // 未读信息对象列表
      messageList: null
    }
  },
  async created () {
    // 如果登录了则去请求信息
    if (this.$store.state.status) {
      // 得到所有的朋友信息
      const { data: res } = await this.$http.get('/friends', this.$store.state.headers)
      this.friendList = res.data
      // 将朋友的id依次放到容器中
      for (const data of this.friendList) {
        this.friendId.push(data.id)
        // 对数据进行处理
        data.homepageLocation = '/chat/userChat/' + data.id
      }
      // 如果朋友数目不为0, 则不断的请求好友的状态信息和未读信息
      if (this.friendId.length !== 0) {
        this.getFriendStatusAndMessage()
        setInterval(() => {
          this.getFriendStatusAndMessage()
        }, 2000)
      }
    } else {
      Dialog.alert({
        title: '提示',
        message: '请先进行登录'
      })
      this.$router.push({ path: '/login' })
    }
  },
  methods: {
    async getFriendStatusAndMessage () {
      const data = new URLSearchParams()
      data.append('idList', this.friendId)
      const { data: res } = await this.$http.post('/friends/queryStatus', data, this.$store.state.headers)
      this.friendStatus = res.data[0]
      this.messageNumber = res.data[1]
      this.messageList = res.data[2]
    }
  }
}
</script>

<style scoped>
</style>
