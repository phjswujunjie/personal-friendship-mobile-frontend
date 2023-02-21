<template>
  <div>
    <van-nav-bar
      style="position: fixed;top: 0;left: 0;right: 0"
      @click-right="onClickRight"
    >
      <template #title>
        <div>
          <router-link to="/chatFront/notice" active-class="homepage-active-class" class="homepage-nav-router">通知</router-link>
          <router-link to="/chatFront/index" active-class="homepage-active-class" class="homepage-nav-router">信息</router-link>
        </div>
      </template>
      <template #right>
        <van-icon name="plus" size="18" />
      </template>
    </van-nav-bar>
    <router-view></router-view>
    <div>
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat-front',
  data () {
    return {
      show: false,
      actions: [{ name: '创建群聊' }]
    }
  },
  methods: {
    onSelect (item) {
      if (item.name === '创建群聊') {
        this.$router.push('/createGroup')
      }
    },
    onClickRight () {
      this.show = true
    }
  }
}
</script>

<style scoped>
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
