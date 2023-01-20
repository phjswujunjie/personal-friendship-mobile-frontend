<template>
  <div id="app">
    <router-view :key="$route.fullPath"/>

    <van-tabbar route :placeholder="true" v-if="(!$route.fullPath.startsWith('/chat/userChat/')) && (exclude.indexOf($route.fullPath) === -1)">
      <van-tabbar-item replace to="/home" icon="home-o" >首页</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="search">发现</van-tabbar-item>
      <van-tabbar-item replace to="/chatFront" icon="envelop-o">信息</van-tabbar-item>
      <van-tabbar-item replace to="/personal" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'my-app',
  data () {
    return {
      // 未读的信息总数
      messageNumber: 0,
      exclude: ['/personalInfo', '/setting', '/login', '/register']
    }
  },
  async created () {
    // 进入网站就向后端发请求是否已经登录
    const { data: res } = await this.$http.get('/users/avatars', this.$store.state.headers)
    // 如果登录
    if (res.code === 20001) {
      // 开启websocket连接
      const webSocket = new WebSocket(this.$webSocketUrl + '/loginInfoWebSocket')
      // 设置登录状态为true
      this.$store.commit('setStatus', true)
      // 登录后将得到的用户id传给后端, 从而将自己上线的信息推送上去
      webSocket.onopen = function () {
        const data = { userId: res.data.id }
        webSocket.send(JSON.stringify(data))
      }
      // 接收后台发送过来的未读的全部信息条数
      webSocket.onmessage = res => {
        if (Number(res.data) !== 0) {
          this.messageNumber = res.data
        }
      }
      // 不断的发情求给后端得到最新的未读信息总数
      setInterval(async () => {
        const { data: res } = await this.$http.get('/chatMessages/queryMessageNumber', this.$store.state.headers)
        if (Number(res.data) !== 0) this.messageNumber = res.data.data
        else this.messageNumber = 0
      }, 5000)
    }
  }
}
</script>
<style lang="less">
</style>
