<template>
  <div>
    <van-nav-bar
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form @submit="onLogin" style="margin-top: 8vh">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
        style="border-top: 1px solid #ebedf0"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <span style="font-size: 0.75rem;position: relative;left: 35vw;top: 10vh">
        还没账号?
        <router-link to="/register" style="font-size: 0.75rem;color: deepskyblue;text-decoration: underline">
          立即注册
        </router-link>
      </span>
      <div style="margin: 15vh 8vh 8vh 8vh">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Dialog } from 'vant'

export default {
  name: 'to-login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async onLogin () {
      const data = new URLSearchParams()
      data.append('account', this.username)
      data.append('password', this.password)
      // 发送账号和密码给后端进行校验是否正确
      const { data: res } = await this.$http({
        method: 'post',
        url: this.$baseUrl + '/loginExamine',
        data: data
      })
      // 如果正确的话则把token存到localStorage中
      if (res.code === 30001) {
        window.localStorage.setItem('token', res.data.token)
        location.href = this.$homepageLocation + 'personal'
      } else {
        // 提示错误
        Dialog.alert({
          title: '标题',
          message: '密码或者账号错误'
        })
      }
    },
    onClickLeft () {
      this.$router.push({ path: '/homepage' })
    }
  }
}
</script>

<style scoped>

</style>
