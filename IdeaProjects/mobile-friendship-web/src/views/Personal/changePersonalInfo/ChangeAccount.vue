<template>
  <div>
    <van-nav-bar
      title="修改账号"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      style="background-color: #ebedf0"
    />
  </div>
</template>

<script>
export default {
  name: 'change-account',
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
