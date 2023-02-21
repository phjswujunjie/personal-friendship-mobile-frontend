<template>
  <div style="margin-top: 13vw">
    <van-cell  is-link to="/group/notice">
      <template #title>
        <span class="custom-title">群聊通知</span>
        <van-badge v-if="unreadEnterMessageNumber !== 0" :content="unreadEnterMessageNumber" style="margin-left: 5px"/>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'chat-front-notice',
  data () {
    return {
      unreadEnterMessageNumber: null
    }
  },
  created () {
    this.getUnreadEnterGroupMessageNumber()
  },
  methods: {
    async getUnreadEnterGroupMessageNumber () {
      const { data: res } = await this.$http.get('/userGroupRelations/leader/unread', this.$store.state.headers)
      console.log(res)
      if (res.code === 20001) {
        this.unreadEnterMessageNumber = Number(res.data)
      }
    }
  }
}
</script>

<style scoped>

</style>
