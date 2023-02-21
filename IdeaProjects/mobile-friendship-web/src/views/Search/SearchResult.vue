<template>
  <div>
    {{ condition }}
  </div>
</template>

<script>
export default {
  name: 'search-result',
  props: ['condition'],
  data () {
    return {
    }
  },
  created () {
    this.getSearchData()
  },
  methods: {
    async getSearchData () {
      const { data: res } = await this.$http.get('/users/search/' + this.condition)
      console.log(res)
    }
  }
}
</script>

<style scoped>

</style>
