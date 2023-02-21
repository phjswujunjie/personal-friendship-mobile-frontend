<!--
  一个User组件对象包含: 用户头像:avatar, 用户id: id, 用户主页地址: homepageLocation, 本人与该用户的关系: relation, 用户昵称: nickname
  用户的简介: introduction
-->
<template>
  <div>
    <div v-if="user" class="display-user" @click="toHomepage">
      <div class="user-avatar">
        <van-image
          width="54px"
          height="54px"
          fit="cover"
          radius="8px"
          :src="user.avatar"
        />
      </div>
      <div class="user-info">
        <div><span class="user-nickname">{{ user.nickname | adjustNick}}</span></div>
        <div style="margin-top: 5px"><span class="user-intro">{{ user.introduction | adjustIntro }}</span></div>
      </div>
      <div>
        <div v-if="relation===50003" @click.stop="show=true">
          <van-button icon="exchange" round size="small" style="width: 100px;height: 30px;margin-top: 20px">互相关注</van-button>
        </div>
        <div v-else-if="relation===50002" @click.stop="show=true">
          <van-button  icon="success" round size="small" style="width: 100px;height: 30px;margin-top: 20px">已关注</van-button>
        </div>
        <div v-else-if="relation===50000" @click.stop="addFollow">
          <van-button  color="orange" plain icon="plus" round size="small" style="width: 100px;height: 30px;margin-top: 20px">关注</van-button>
        </div>
        <div v-else-if="relation===50001" @click.stop="addFollow">
          <van-button icon="plus"  color="orange" plain round size="small" style="width: 100px;height: 30px;margin-top: 20px">回关</van-button>
        </div>
      </div>
    </div>
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
import { Dialog, Toast } from 'vant'

export default {
  name: 'single-user',
  filters: {
    adjustIntro (val) {
      if (val.trim() === '') return '暂无简介'
      if (val.length > 15) {
        return val.substring(0, 15) + '...'
      } else return val
    },
    adjustNick (val) {
      if (val.length > 11) return val.substring(0, 11) + '...'
      else return val
    }
  },
  watch: {
    userVal: {
      handler (val, oldVal) {
        this.user = val
      },
      deep: true
    }
  },
  props: ['userVal'],
  data () {
    return {
      user: this.userVal,
      // 本人跟该用户之间的关系
      relation: this.userVal.relation,
      show: false,
      actions: [{ name: '设为特别关注' }, { name: '设置分组' }, { name: '设置备注' }, { name: '取消关注', color: 'red' }]
    }
  },
  methods: {
    toHomepage () {
      this.$router.push({ path: '/u/' + this.user.id })
    },
    onSelect (item) {
      // 如果为取消关注的操作
      if (item.name === '取消关注') {
        Dialog.confirm({
          title: '提示',
          message: '确定取消关注吗?'
        }).then(this.deleteFollow)
      }
    },
    // 点击关注别人后触发的事件
    async addFollow () {
      // 没有登录则提示用户登录
      if (this.relation === 30000) {
        Dialog.alert({
          title: '提示',
          message: '请先进行登录'
        })
      } else {
        // 登录后则进行关注的操作
        const { data: res } = await this.$http.post('/friends/' + this.user.id, {}, this.$store.state.headers)
        if (res.code === 23001) {
          // 如果被访问者为访问者的粉丝, 则显示互相关注的图标
          if (this.relation === 50001) {
            this.relation = 50003
          } else {
            // 否则显示已关注的图标
            this.relation = 50002
          }
          Toast.success('关注成功')
        } else {
          // 关注操作失败
          Dialog.alert({
            title: '提示',
            message: '关注操作失败'
          })
        }
      }
    },
    // 点击取消关注后触发的事件
    async deleteFollow () {
      const { data: res } = await this.$http.delete('/friends/' + this.user.id, this.$store.state.headers)
      if (res.code === 21001) {
        // 取消关注, 如果被访问者为访问者的朋友
        if (this.relation === 50003) {
          this.relation = 50001
        } else {
          // 没有任何关系
          this.relation = 50000
        }
        Toast.success('取消关注成功')
      } else {
        Dialog.alert({
          title: '提示',
          message: '取消关注失败'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.display-user {
  display: flex;
  background-color: white;
  height: 70px;
  padding: 0 8px 0 10px;
  border-bottom: 1px solid #ebedf0;

  .user-avatar {
    margin-top: 7px;
  }

  .user-info {
    flex-grow: 1;
    margin-top: 8px;
    margin-left: 7px;

    .user-nickname {
      color: orange;
    }

    .user-intro {
      font-size: 0.75rem;
      color: #646566;
    }
  }
}
</style>
