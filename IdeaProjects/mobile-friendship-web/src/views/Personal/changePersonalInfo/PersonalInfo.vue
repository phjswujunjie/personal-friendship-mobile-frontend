<template>
  <div>
    <div>
      <van-nav-bar
        title="个人信息"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      />
    </div>
    <div v-if="info">
      <van-cell title="头像" is-link value="内容" />
      <van-cell title="昵称" is-link :value="info.nickname" />
      <van-cell title="账号" is-link :value="info.account" />
      <van-cell title="性别" is-link :value="info.gender"/>
      <van-cell title="地区" is-link :value="info.address"/>
      <van-cell title="个性签名" is-link :value="info.introduction"/>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'personal-info',
  data () {
    return {
      info: null,
      status: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const { data: res } = await this.$http.get('/users', this.$store.state.headers)
      if (res.code === 20001) {
        res.data.avatar = this.$baseUrl + '/static/upload/' + res.data.avatar
        this.info = res.data
        this.status = true
      } else {
        Toast('请先登录')
        location.href = this.$homepageLocation + 'login'
      }
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
