<template>
  <div>
    <van-nav-bar
      title="注册"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form validate-first @failed="onFailed" style="margin-top: 10vh" @submit="registerUser">
      <!-- 通过 validator 进行函数校验 -->
      <van-field
        label="账号"
        v-model="account"
        name="validator"
        placeholder="请输入由10位数字组成的账号"
        :rules="[{ validator:accountValidator, message: '格式不正确或者账号已经存在' }]"
      />
      <van-field
        label="密码"
        v-model="password"
        type="password"
        name="validator"
        placeholder="请输入8-15位由数字,字母,常用字符组成的密码"
        :rules="[{ validator:passwordValidator, message: '密码格式不正确' }]"
      />
      <van-field
        label="再次输入密码"
        v-model="password1"
        type="password"
        name="validator"
        placeholder="请再次输入密码"
        :rules="[{ validator:passwordValidatorAgain, message: '密码输入不一致' }]"
      />
      <van-field
        label="验证码"
        v-model="code"
        name="validator"
        placeholder="请输入下图中的验证码"
        :rules="[{ validator:codeValidator, message: '验证码错误' }]"
      />
      <div id="verify-img">

      </div>
      <div class="tip-text">
        <span>看不清?点击图片试试!</span>
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { GVerify } from '@/assets/js/Verify'
import { Dialog } from 'vant'

export default {
  name: 'to-register',
  data () {
    return {
      account: '',
      password: '',
      password1: '',
      code: '',
      verifyCode: null
    }
  },
  mounted () {
    this.verifyCode = new GVerify({
      // 容器的ID
      id: 'verify-img',
      // 图形验证码的类型：blend-数字字母混合类型(默认)、number-纯数字、letter-纯字母
      type: 'blend'
    })
  },
  methods: {
    // 提交注册的账号和密码
    async registerUser () {
      const data = new URLSearchParams()
      data.append('account', this.account)
      data.append('password', this.password)
      const { data: res } = await this.$http.post('/registerUser', data)
      // 如果成功, 则存储token信息
      if (res.code === 23001) {
        window.localStorage.setItem('token', res.data.token)
        location.href = this.$homepageLocation + '/homepage'
      } else {
        // 失败则进行提示
        Dialog.alert({
          title: '提示',
          message: '密码或者账号不符合要求'
        })
      }
    },
    /*
      下面的全是校验规则
     */
    codeValidator (val) {
      return this.verifyCode.validate(val)
    },
    passwordValidatorAgain (val) {
      return val === this.password
    },
    passwordValidator (val) {
      return /^[a-zA-Z\d^*!_]{8,15}$/.test(val)
    },
    async accountValidator (val) {
      if (!/^[1-9]\d{9}$/.test(val)) return false
      const data = new URLSearchParams()
      data.append('account', val)
      const { data: res } = await this.$http.post('/accountIsExists', data)
      return res.code !== 40000
    },
    onFailed (errorInfo) {
      this.verifyCode.refresh()
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
#verify-img {
  width: 50vw;
  height: 10vh;
  margin: 5vw auto 0;
}

.tip-text {
  width: 40vw;
  margin: 2vw auto 0;
  font-size: 0.75rem;
  font-weight: lighter;
}
</style>
