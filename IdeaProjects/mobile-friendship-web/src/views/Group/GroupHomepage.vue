<template>
  <div v-if="groupInfo">
    <div>
      <van-nav-bar
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        style="background-color: white"
      >
        <template #right>
          <van-icon name="ellipsis" size="18"/>
        </template>
      </van-nav-bar>
    </div>
    <div style="background-color: white;padding:10px;">
      <div style="display: flex;">
        <div>
          <van-image
            :src="groupInfo.groupAvatar"
            fit="cover"
            width="45px"
            height="45px"
            radius="5px"
          />
        </div>
        <div style="margin-left: 12px;">
          <div style="font-weight: bold">{{groupInfo.groupName}}</div>
          <div style="margin-top: 8px;font-size: 0.75rem;font-weight: lighter">{{ groupInfo.groupId }}</div>
        </div>
      </div>
      <div style="margin-top: 10px;font-size: 0.85rem">
        <van-icon name="clock-o" color="#969799"/>
        <span style="margin-left: 10px;color: #969799">{{groupInfo.groupCreateTime}}</span>
      </div>
      <div style="margin-top: 10px;font-size: 0.85rem">
        <van-icon name="description" color="#969799"/>
        <span style="margin-left: 10px;color: #969799">{{ groupInfo.groupIntroduction === '' ? '暂无介绍' : groupInfo.groupIntroduction}}</span>
      </div>
    </div>
    <div style="background-color: white;padding:10px;margin-top: 8px;display: flex">
      <div>dwd</div>
      <div>dwd</div>
      <div>d</div>
    </div>
    <div style="position: fixed;left: 0;width: 100%;bottom: 0;background-color: white;padding: 8px">
      <div style="display: flex;justify-content: space-evenly" v-if="isGroupMember">
        <div><van-button type="default" style="width: 45vw">分享群聊</van-button></div>
        <router-link :to="'/chat/group/' + id"><van-button type="info" style="width: 45vw">发送信息</van-button></router-link>
      </div>
      <div v-else>
       <div @click="applyJoinGroup"> <van-button type="info" style="width: 95vw">申请加入群聊</van-button></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'group-homepage',
  props: ['id'],
  data () {
    return {
      groupInfo: null,
      loginStatus: false,
      isGroupMember: null
    }
  },
  created () {
    this.getGroupHomepageData()
  },
  methods: {
    async applyJoinGroup () {
      const { data: res } = await this.$http.post('/userGroupRelations/' + this.id, {}, this.$store.state.headers)
      console.log(res)
      if (res.code === 23001) {
        Toast.success('申请成功')
      }
    },
    async getGroupHomepageData () {
      const { data: res } = await this.$http.get('/groups/homepage/' + this.id, this.$store.state.headers)
      if (res.code === 20001) {
        this.groupInfo = res.data[0]
        this.loginStatus = res.data[0].loginStatus
        if (this.loginStatus) this.isGroupMember = res.data[0].isGroupMember
        console.log(res)
      }
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    // 跳转到群的信息页面
    onClickRight () {
      console.log('right')
    }
  }
}
</script>

<style scoped>

</style>
