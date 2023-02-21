<template>
  <div v-if="groupNotices">
    <div>
      <van-nav-bar
        title="群通知"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div>
      <div v-if="groupNotices.length === 0" style="text-align: center;color: #969799;margin-top: 10px">
        <span>暂无群通知信息哦~~</span>
      </div>
      <div v-else>
        <single-group-notice :notice-val="notice"  v-for="(notice, index) in groupNotices" :key="notice.userId + '' + notice.groupId + index">
        </single-group-notice>
      </div>
    </div>
  </div>
</template>

<script>
import SingleGroupNotice from '@/components/Group/SingleGroupNotice.vue'

export default {
  name: 'group-notice',
  components: {
    'single-group-notice': SingleGroupNotice
  },
  data () {
    return {
      groupNotices: null
    }
  },
  created () {
    this.getGroupNoticesData()
  },
  methods: {
    async getGroupNoticesData () {
      const { data: res } = await this.$http.get('/userGroupRelations/leader', this.$store.state.headers)
      if (res.code === 20001) {
        this.groupNotices = res.data
        console.log(this.groupNotices)
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
