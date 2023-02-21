<template>
  <div v-if="introduction!==null">
    <div>
      <van-nav-bar
        title="个性签名"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      >
        <template #right v-if="introduction !== $store.state.info.introduction">
          <van-button type="primary" size="small" @click="changeIntroduction">完成</van-button>
        </template>
        <template #right v-else>
          <van-button type="primary" disabled size="small" @click="changeIntroduction">完成</van-button>
        </template>
      </van-nav-bar>
    </div>
    <div style="padding: 2vh 3vw">
      <input type="text" class="personal-info-introduction-input" v-model="introduction">
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
        this.introduction = val.introduction
      },
      deep: true
    }
  },
  data () {
    return {
      introduction: this.$store.state.info ? this.$store.state.info.introduction : null
    }
  },
  methods: {
    async changeIntroduction () {
      const val = new URLSearchParams()
      val.append('newVal', this.introduction)
      const { data: res } = await this.$http.put('/users/change/3', val, this.$store.state.headers)
      if (res.code === 22001) {
        this.$store.state.info.introduction = this.introduction
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
