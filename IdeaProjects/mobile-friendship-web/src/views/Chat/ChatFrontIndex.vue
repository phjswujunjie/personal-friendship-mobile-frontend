<template>
  <div>
        <van-pull-refresh
          v-model="isLoading"
          success-text="刷新成功"
          @refresh="onRefresh"
          style="min-height: 100vh"
        >
        <van-search v-model="value" placeholder="搜索聊天记录" style="margin-top: 12vw"/>
        <div v-if="messageNumber">
          <SingleFriendChatCard :unread-message-val="Number(messageNumber[friend.id]) > 0 ? messageList[friend.id].content : ''"
                                :unread-message-number-val="messageNumber[friend.id]"
                                :nickname-val="friend.nickname"
                                :homepage-location-val="friend.homepageLocation" :avatar-val="friend.avatar"
                                v-for="friend in friendList"
                                :key="friend.id"
          />
        </div>
        <div>
          <Group v-for="group in groups" :avatar-val="$baseUrl + 'static/upload/' +group.groupAvatar"
                 :homepage-location-val="'/chat/group/' + group.groupId"
                 :nickname-val="group.groupNickname === ''?group.groupName:group.groupNickname" :key="group.id"/>
        </div>
        </van-pull-refresh>
  </div>
</template>

<script>
import SingleFriendChatCard from '@/components/FriendChatCard/SingleFriendChatCard.vue'
import Group from '@/components/Group/Group.vue'
import { Dialog } from 'vant'

export default {
  name: 'chat-front-index',
  components: {
    SingleFriendChatCard,
    Group
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
      messageList: null,
      isLoading: false,
      show: false,
      actions: [{ name: '创建群聊' }],
      groups: null
    }
  },
  created () {
    this.getFriendMessageChannel()
    this.getGroupData()
  },
  methods: {
    async getGroupData () {
      const { data: res } = await this.$http.get('/userGroupRelations', this.$store.state.headers)
      if (res.code === 20001) this.groups = res.data
      console.log(this.groups)
    },
    onSelect (item) {
      if (item.name === '创建群聊') {
        this.$router.push('/createGroup')
      }
    },
    onClickRight () {
      this.show = true
    },
    async getFriendMessageChannel () {
      // 得到所有的朋友信息
      const { data: res } = await this.$http.get('/friends', this.$store.state.headers)
      // 如果登录了则渲染好友列表
      if (res.code === 20001) {
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
    onRefresh () {
      this.getFriendStatusAndMessage()
      this.$nextTick(() => {
        this.isLoading = false
        console.log('fresh')
      })
    },
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
