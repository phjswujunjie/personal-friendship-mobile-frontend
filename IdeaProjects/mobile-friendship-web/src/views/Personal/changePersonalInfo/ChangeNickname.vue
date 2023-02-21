<template>
  <div v-if="nickname!==null">
    <div>
      <van-nav-bar
        title="个性签名"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      >
        <template #right v-if="nickname !== $store.state.info.nickname">
          <van-button type="primary" size="small" @click="changeNickname">完成</van-button>
        </template>
        <template #right v-else>
          <van-button type="primary" disabled size="small" @click="changeNickname">完成</van-button>
        </template>
      </van-nav-bar>
    </div>
    <div style="padding: 2vh 3vw">
      <input type="text" class="personal-info-introduction-input" v-model="nickname">
      <p style="margin: 10px 4px;font-size: 0.75rem;color: #969799">好名字可以让你的朋友更容易记住你</p>
    </div>
  </div>
</template>

<script>
import { Notify } from 'vant'

export default {
  name: 'change-introduction',
  watch: {
    '$store.state.info': {
      handler (val, oldVal) {
        this.nickname = val.nickname
      },
      deep: true
    }
  },
  data () {
    return {
      nickname: this.$store.state.info ? this.$store.state.info.nickname : null
    }
  },
  methods: {
    async changeNickname () {
      const val = new URLSearchParams()
      val.append('newVal', this.nickname)
      const { data: res } = await this.$http.put('/users/change/2', val, this.$store.state.headers)
      if (res.code === 22001) {
        this.$store.state.info.nickname = this.nickname
        this.onClickLeft()
      } else Notify({ type: 'danger', message: res.msg })
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.personal-info-introduction-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid lightgray;
  background-color: #ebedf0;
}

.personal-info-introduction-input:focus{
  border-bottom: 1px solid #42b983;
}

</style>
