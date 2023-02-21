<template>
  <div>
    <div>
      <van-nav-bar right-text="按钮"
                   @click-right="onClickRight"
                   style="position: fixed;left: 0;right: 0;top: 0"
      >
        <template #title>
          <div>
            <router-link to="/homepage/follow" active-class="homepage-active-class" class="homepage-nav-router">关注</router-link>
            <router-link to="/homepage/recommend" active-class="homepage-active-class" class="homepage-nav-router">推荐</router-link>
          </div>
        </template>
        <template #right>
          <router-link to="/createBlog">
            <van-icon name="add" size="1.5rem" color="orange" title="发博客"/>
          </router-link>
        </template>
      </van-nav-bar>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homepage-com',
  data () {
    return {
      active: 1,
      blogs: null
    }
  },
  methods: {
    onClickRight () {
      console.log('right')
    }
  }
}
</script>

<style scoped lang="less">
.homepage-nav-router {
  color: #969799;
  margin: 0 5vw;
}

.homepage-active-class {
  font-weight: bolder;
  color: black;
  border-bottom: 3px solid orange;
}
</style>
