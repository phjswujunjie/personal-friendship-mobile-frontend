<template>
  <div v-if="address!==null">
    <div>
      <van-nav-bar
        title="选择地区"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      />
    </div>
    <div>
      <van-cell title="当前地区" :value="address" icon="location-o" style="margin-bottom: 10px"/>
    </div>
    <div>
      <van-area @cancel="onClickLeft" @confirm="changeArea" :area-list="areaList" :columns-num="2" />
    </div>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data'
import { Notify } from 'vant'

export default {
  name: 'change-address',
  watch: {
    '$store.state.info': {
      handler (val, oldVal) {
        this.address = val.address
      },
      deep: true
    }
  },
  data () {
    return {
      areaList,
      address: this.$store.state.info ? this.$store.state.info.address : null
    }
  },
  methods: {
    // 提交修改地区
    async changeArea (val) {
      const data = new URLSearchParams()
      let area
      // 修改地区的格式
      if (val[0].name === val[1].name) area = val[0].name
      else area = val[0].name + '/' + val[1].name
      data.append('newVal', area)
      // 提交数据
      const { data: res } = await this.$http.put('/users/change/4', data, this.$store.state.headers)
      if (res.code === 22001) {
        // 改变info中的值
        this.$store.state.info.address = area
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
