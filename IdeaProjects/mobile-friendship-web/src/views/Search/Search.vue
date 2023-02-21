<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="输入查找用户的昵称或者账号"
        @search="onSearch"
      >
        <template #action>
          <van-icon @click="onSearch" name="search" size="1.5rem" style="margin-left: 7px;position: relative;top: 3px"/>
        </template>
      </van-search>
    </form>
  </div>
</template>

<script>
export default {
  name: 'search-com',
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onSearch () {
      if (this.value.trim() !== '') {
        this.$router.push('/search/' + this.value.trim())
      }
    }
  }
}
</script>

<style scoped>

</style>
