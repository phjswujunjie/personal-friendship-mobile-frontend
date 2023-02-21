<!-- 用来展示与好友聊天的组件   -->
<template>
  <router-link :to="homepageLocation">
    <van-swipe-cell style="border-bottom: 1px solid #ebedf0 ">
      <van-card
        class="goods-card"
        :thumb="avatar"
        currency=""
      >
<!--        <template #tag v-if="Number(unreadMessageNumber) > 0">-->
<!--          <van-badge :content="Number(unreadMessageNumber)" style="position: relative;left: 25px;bottom: 10px"/>-->
<!--        </template>-->
<!--        <template #price>-->
<!--          <p  v-if="Number(unreadMessageNumber) > 0" style="margin: 0;color: lightgray">-->
<!--            {{unreadMessage | showMessage}}-->
<!--          </p>-->
<!--        </template>-->
        <template #title>
          <p style="margin: 0;font-weight: bolder;font-size: 0.8rem">{{nickname}}</p>
        </template>
      </van-card>
      <template #right>
        <van-button square text="删除" type="danger" class="delete-button" />
      </template>
    </van-swipe-cell>
  </router-link>
</template>

<script>
export default {
  name: 'SingleFriendChatCard',
  props: ['avatarVal', 'nicknameVal', 'homepageLocationVal'],
  data () {
    return {
      avatar: this.avatarVal,
      nickname: this.nicknameVal,
      homepageLocation: this.homepageLocationVal
    }
  }
  // filters: {
  //   showMessage (val) {
  //     if (val.replaceAll('<br/>', ' ').length > 12) {
  //       return val.replaceAll('<br/>', ' ').substring(0, 12) + '...'
  //     }
  //     return val.replaceAll('<br/>', ' ')
  //   }
  // }
}
</script>

<style scoped>
.goods-card {
  margin: 0;
  background-color: white;
}

.delete-button {
  height: 100%;
}
</style>
