<template>
  <div v-if="users">
    <div>
      <van-nav-bar
        title="关注"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="position: fixed;top: 0;left: 0;right: 0;background-color: #ebedf0"
      />
    </div>
    <div style="margin-top: 14vw">
      <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
        style="min-height: 100vh"
      >
        <single-user v-for="user in users" :key="user.id" :user-val="user"/>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import User from '@/components/User/User'

export default {
  name: 'follow-com',
  components: {
    'single-user': User
  },
  data () {
    return {
      users: null,
      isLoading: false
    }
  },
  created () {
    this.getFollowerData()
  },
  methods: {
    async getFollowerData () {
      const { data: res } = await this.$http.get('/friends/follow', this.$store.state.headers)
      this.users = [...res.data[0], ...res.data[1]]
      console.log(this.users)
    },
    onRefresh () {
      this.getFollowerData()
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
</style>
