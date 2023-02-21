<template>
  <div style="display: flex;flex-direction: column;height: 100vh">
    <div>
      <van-nav-bar
        :title="groupName + '(' + groupMemberNumber + ')'"
        left-text="返回"
        right-text="按钮"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <template #right>
          <van-icon name="wap-nav" size="18"/>
        </template>
      </van-nav-bar>
    </div>
    <div @click="showEmojiFlag= -1" style="overflow: auto;box-sizing: border-box;flex-grow: 1" ref="messageDiv">
      <ul>
        <SingleMessageDisplay :key="message.id" :message-val="message" :show-nickname="true"
                              :direction-mark-val="Number(message.userId) !== Number(selfId)" v-for="message in chatMessages"/>
      </ul>
    </div>
    <div style="display: flex;background-color: white;padding: 1vh">
      <div style="flex-grow: 1;">
        <textarea ref="textArea" @click.stop="showEmojiFlag = -1" v-model="message" placeholder="请输入内容" class="message-input"></textarea>
      </div>
      <div style="margin-left: 10px;width: 30vw;display: flex;justify-content: space-evenly;">
        <van-icon name="photo-o" size="1.5rem" class="icon-style"/>
        <van-icon name="smile-o" size="1.5rem" @click="clickEmoji" class="icon-style" />
        <van-button type="primary" size="small" style="margin-top: 0.5vh" @click="sendMessage">发送</van-button>
      </div>
    </div>
    <div class="emoji-div" v-if="showEmojiFlag === 1">
      <EmojiSelector style="height: 30vh;width: 100vw;" @select="selectEmoji"/>
      <div class="remove-emoji-div" @click="removeEmoji">
        <van-icon name="clear" size="1.5rem" color="lightgray" style="margin-left: 1.75vh;margin-top: 0.75vh"/>
      </div>
    </div>
  </div>
</template>

<script>
import SingleMessageDisplay from '@/components/Message/SingleMessageDisplay'
import { Dialog } from 'vant'

export default {
  name: 'chat-with-group',
  components: {
    SingleMessageDisplay
  },
  props: ['id'],
  data () {
    return {
      // 控制表情框的显示
      showEmojiFlag: -1,
      // 聊天群组的人数
      groupMemberNumber: null,
      // 聊天群组的名字
      groupName: null,
      // 所有的聊天信息
      chatMessages: null,
      // 自己的头像地址
      selfAvatar: null,
      // 要进行发送的信息
      message: '',
      // 本人的id
      selfId: null,
      // 本人昵称
      selfNickname: null,
      messageSocket: null,
      originHeight: window.innerHeight
    }
  },
  created () {
    this.getBeforeMessage()
  },
  mounted () {
    // 当弹起键盘时, 将储存信息的div的滚动条拉到最底部
    window.addEventListener('resize', () => {
      if (window.innerHeight < this.originHeight) {
        this.$refs.messageDiv.scrollTop = this.$refs.messageDiv.scrollHeight
      }
    })
  },
  methods: {
    // 得到该群聊的所有以前的信息
    async getBeforeMessage () {
      // 得到与聊天对象的所有聊天信息
      const { data: res } = await this.$http.get('/groupMessages/' + this.id, this.$store.state.headers)
      console.log(res)
      if (res.code === 20001) {
        // 设置自己的头像地址
        this.selfAvatar = res.data[0].selfAvatar
        // 设置聊天对象的昵称
        this.groupName = res.data[0].groupName
        // 得到自己的id
        this.selfId = res.data[0].selfId
        // 得到群组的总人数
        this.groupMemberNumber = res.data[0].groupMemberNumber
        // 得到自己的昵称
        this.selfNickname = res.data[0].selfNickname
        console.log(res.data[0])
        // 得到全部的信息
        this.chatMessages = res.data.slice(1, res.data.length)
        console.log(this.chatMessages)
        this.$nextTick(() => {
          this.$refs.messageDiv.scrollTop = this.$refs.messageDiv.scrollHeight
        })
        this.messageSocket = new WebSocket(this.$webSocketUrl + '/groupWebSocket')
        this.messageSocket.onopen = () => {
          // 当刚建立webSocket连接时, 将用户自己的id和群组id发给后端准备通过webSocket拉取最新的信息, 并进行相关的操作
          const data = {
            userId: this.selfId + '',
            groupId: this.id
          }
          this.messageSocket.send(JSON.stringify(data))
        }
        this.processReceivedMessage()
      } else if (res.code === 438) {
        Dialog.alert({
          title: '提示',
          message: '非法请求, 不要触碰底线!!!!'
        })
        this.$router.push({ path: '/homepage' })
      } else {
        this.$router.push({ path: '/homepage' })
      }
    },
    // 处理接收到的信息
    processReceivedMessage () {
      // 接收从服务器传过来的信息
      this.messageSocket.onmessage = res => {
        const message = JSON.parse(res.data)
        console.log(message)
        // 如果该信息的目标聊天群为本群, 则在界面中显示信息
        if (Number(message.groupId) === Number(this.id)) {
          this.chatMessages.push(message)
          this.$nextTick(() => {
            this.$refs.messageDiv.scrollTop = this.$refs.messageDiv.scrollHeight
          })
        } else {
          // 如果不是的话则将此信息再发送给后端存储为未读信息
          console.log('is not self group')
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
          nickname: this.selfNickname,
          groupId: this.id,
          media: '',
          avatar: this.selfAvatar,
          id: Math.random().toString(16).slice(2)
        }
        this.chatMessages.push(messageInfo)
        this.$nextTick(() => {
          this.$refs.messageDiv.scrollTop = this.$refs.messageDiv.scrollHeight
        })
        const data = {
          content: this.message,
          userId: this.selfId + '',
          groupId: this.id
        }
        // 发送信息
        this.messageSocket.send(JSON.stringify(data))
        this.message = ''
        // 如果是在表情框展示的时候发送的信息, 移动端则将禁止键盘的弹起
        if (this.showEmojiFlag === 1) {
          this.stopKeyboard()
        } else {
          // 允许键盘的弹起
          this.$refs.textArea.focus()
        }
      }
    },
    // 得到光标却又禁止键盘的弹起
    stopKeyboard () {
      this.$refs.textArea.setAttribute('readonly', 'readonly')
      this.$refs.textArea.focus()
      setTimeout(() => {
        this.$refs.textArea.removeAttribute('readonly')
      })
    },
    // 点击表情框里的删除icon后对字符进行相应的删除
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
    onClickLeft () {
      this.$router.push('/chatFront/index')
    },
    // 跳转到群的信息页面
    onClickRight () {
      this.$router.push('/chat/group/info/' + this.id)
    }
  }
}
</script>

<style scoped lang="less">
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
