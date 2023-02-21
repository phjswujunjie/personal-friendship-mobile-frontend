<template>
  <div>
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
      style="min-height: 100vh"
    >
      <div style="margin-top: 46px"></div>
      <single-blog :show-follow-button="false" :show-remove-icon="true" :blog-val="blog" v-for="(blog) in blogs" :key="blog.id"/>
    </van-pull-refresh>
  </div>
</template>

<script>
import SingleBlog from '@/components/Blog/SingleBlog'
import { Dialog } from 'vant'

export default {
  name: 'follow-com',
  data () {
    return {
      blogs: null,
      isLoading: false
    }
  },
  components: {
    'single-blog': SingleBlog
  },
  created () {
    this.getBlogData()
  },
  methods: {
    // 刷新页面
    onRefresh () {
      this.getBlogData()
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
    // 得到关注的人的博客
    async getBlogData () {
      const { data: res } = await this.$http.get('/blogs/follow', this.$store.state.headers)
      if (res.code === 20001) {
        this.blogs = res.data
        console.log(this.blogs)
      } else if (res.code === 30000) {
        Dialog.alert({
          title: '提示',
          message: '请先进行登录'
        })
        this.$router.push({ path: '/login' })
      }
    }
  }
}
</script>

<style scoped>

</style>
