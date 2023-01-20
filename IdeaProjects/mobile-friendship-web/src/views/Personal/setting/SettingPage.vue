<template>
  <div>
    <van-nav-bar
      title="设置"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div>
      <van-cell-group style="margin-top: 10px">
        <van-cell title="退出登录" @click="logOut"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'

export default {
  name: 'setting-page',
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    logOut () {
      Dialog.confirm({
        title: '提示',
        message: '确定退出吗'
      }).then(() => {
        // 确定退出
        window.localStorage.removeItem('token')
        location.href = this.$homepageLocation + 'login'
      })
    }
  }
}
</script>

<style scoped>

</style>
