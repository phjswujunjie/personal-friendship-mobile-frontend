<template>
  <div style="display: flex;background-color: white;padding: 8px">
    <div>
      <router-link :to="'/u/' + notice.userId">
        <van-image
          width="45px"
          height="45px"
          fit="contain"
          radius="5px"
          :src="notice.userAvatar"
        />
      </router-link>
    </div>
    <div style="font-size: 0.85rem;line-height: 45px;margin-left: 10px;flex-grow: 1">
            <span><router-link :to="'/u/' + notice.userId" style="color: deepskyblue">{{notice.userNickname}}</router-link>申请加入
              <router-link :to="'/g/' + notice.groupId" style="color: deepskyblue">{{notice.groupName}}</router-link>群聊</span>
    </div>
    <div style="margin-top: 8px" v-if="showButton">
      <van-button @click="allow" round plain type="primary" size="small" style="width: 55px">同意</van-button>
      <van-button @click="refuse" round plain type="danger" size="small" style="width: 55px;margin-left: 10px">拒绝</van-button>
    </div>
    <div style="line-height: 45px;margin-right: 20px;color: #969799" v-if="show">
      <span v-if="operate==='refuse'"><van-icon name="cross"/>已拒绝</span>
      <span v-if="operate==='allow'"><van-icon name="success"/>已同意</span>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'single-group-notice',
  props: ['noticeVal'],
  data () {
    return {
      notice: this.noticeVal,
      operate: null,
      showButton: true,
      show: false
    }
  },
  methods: {
    refuse () {
      this.show = true
      this.showButton = false
      this.operate = 'refuse'
      Toast.success('拒绝成功')
    },
    async allow () {
      const data = new FormData()
      data.append('userId', this.notice.userId)
      data.append('groupId', this.notice.groupId)
      const { data: res } = await this.$http.put('/userGroupRelations', data, this.$store.state.headers)
      console.log(res)
      if (res.code === 22001) {
        this.show = true
        this.showButton = false
        this.operate = 'allow'
        Toast.success('操作成功!')
      }
    }
  }
}
</script>

<style scoped>

</style>
