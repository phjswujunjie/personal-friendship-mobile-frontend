<template>
  <div v-if="gender!==null">
    <div>
      <van-nav-bar
        title="修改性别"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      >
        <template #right>
          <van-button type="primary" size="small" @click="changeGender">完成</van-button>
        </template>
      </van-nav-bar>
    </div>
    <div>
      <van-radio-userGroup v-model="gender">
        <van-cell-userGroup>
          <van-cell title="女" clickable @click="gender = '女'">
            <template #right-icon>
              <van-radio name="女" />
            </template>
          </van-cell>
          <van-cell title="男" clickable @click="gender = '男'">
            <template #right-icon>
              <van-radio name="男" />
            </template>
          </van-cell>
        </van-cell-userGroup>
      </van-radio-userGroup>
    </div>
  </div>
</template>

<script>
import { Notify } from 'vant'

export default {
  name: 'change-gender',
  /**
   * 由于有很多的修改单个字段的页面, 频繁的请求后端得到数据不太合适, 当主页面加载时会向后端请求得到用户的全部数据info, 将此数据存放到Vuex中,
   * 但是主页面的是异步请求得到数据才修改Vuex中的值, 这是耗时的操作, 当我们在当前的修改页面时,可能修改页面加载完数据后主页面的异步请求才得到数据
   * 从而修改Vuex中的值, 这时修改页面得到的info还是为null, 从而没有得到数据, 页面渲染不正确
   */
  watch: {
    // 我们在这里监测$store.state.info值的变化, 当此值变化时则意为着得到了用户的信息(主页面的异步请求已经完成), 从而改变gender的值
    '$store.state.info': {
      handler (val, oldVal) {
        this.gender = val.gender
      },
      deep: true
    }
  },
  data () {
    return {
      // 这里为什么要进行判断? 因为有时候主页面的异步请求快, $store.state.info的值已经变化了, 此时才开始加载修改页面, 则监测器不会被触发
      // 如果this.$store.state.info的值为null, 则说明主页面的异步请求还没有完成, 将gender设置为null让修改页面不被渲染(过一段时间后info的值
      // 会被修改从而触发监测器, 将gender的值重新设置为info中正确的gender),
      // 如果this.$store.state.info的值不为null, 则说明主页面的异步请求已经完成(info已经有数据了), 则直接设置gender的值即可
      gender: this.$store.state.info ? this.$store.state.info.gender : null
    }
  },
  methods: {
    async changeGender () {
      const val = new URLSearchParams()
      val.append('newVal', this.gender)
      const { data: res } = await this.$http.put('/users/change/1', val, this.$store.state.headers)
      if (res.code === 22001) {
        this.$store.state.info.gender = this.gender
        this.onClickLeft()
      } else Notify({ type: 'danger', message: res.msg })
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
