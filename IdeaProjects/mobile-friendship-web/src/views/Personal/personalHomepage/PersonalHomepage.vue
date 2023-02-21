<template>
  <div  v-if="info">
    <div>
        <van-nav-bar
          left-text="返回"
          left-arrow
          class="self-homepage-navbar opacity-style"
          @click-left="onClickLeft"
          id="navbar"
        />
    </div>
    <div style="margin-bottom: 50px" class="self-homepage-main">
      <div ref="backgroundImage">
        <van-image
          src="http://192.168.10.112:8888/static/upload/img.png"
          fit="cover"
          width="100vw"
          height="55vw"
        />
      </div>
      <div ref="fansFollow" class="self-homepage-fans-follow">
        <div style="margin-left: 14px;position: relative;bottom: 20px">
          <van-image
            :src="info.avatar"
            width="60px"
            height="60px"
            radius="5px"
          />
        </div>
        <div style="margin: 0 0 0 15px">
          <div>
            <span style="font-weight: bolder">{{info.nickname}}</span>
          </div>
          <div style="display: flex;font-size: 0.75rem;margin-top: 3px">
            <div>
              <span style="color: #969799;">账号&nbsp;<span style="font-weight: bold;color: black">{{info.account}}</span></span>
            </div>
            <div>
              <span style="color: #969799;margin-left: 15px"><span style="font-weight: bold;color: black">{{info.fansNumber}}</span>&nbsp;粉丝</span>
            </div>
            <div>
              <span  style="color: #969799;margin-left: 15px"><span style="font-weight: bold;color: black">{{info.followNumber}}</span>&nbsp;关注</span>
            </div>
          </div>
        </div>
      </div>
      <div ref="intro" class="self-homepage-intro">
        <div style="text-align: right">
          <van-icon name="arrow-down" v-if="iconChange===1" @click="iconChange=-1"/>
          <van-icon name="arrow-up" v-else @click="iconChange=1"/>
        </div>
        <div style="color: #969799">
          <van-icon name="description" />
          <span style="font-size: 0.9rem;margin-left: 5px">{{info.introduction === '' ? '暂无简介' : info.introduction }}</span>
        </div>
        <div style="color: #969799" v-if="iconChange===-1">
          <div style="margin-top: 5px">
            <van-icon name="notes-o" />
            <span style="font-size: 0.9rem;margin-left: 5px">{{info.birthday}}</span>
          </div>
          <div style="margin-top: 5px">
            <van-icon name="map-marked"/>
            <span style="font-size: 0.9rem;margin-left: 5px">{{info.address}}</span>
          </div>
          <div style="margin-top: 5px">
            <van-icon name="calender-o"/>
            <span style="font-size: 0.9rem;margin-left: 5px">{{info.registerTime}}&nbsp;注册</span>
          </div>
          <div style="text-align: center;font-size: 1rem;padding: 20px 0 0 0">
            <router-link to="to" style="color: #969799">
              <span>更多资料</span>
              <van-icon name="arrow"/>
            </router-link>
          </div>
        </div>
      </div>
      <div ref="swipeBar" style="margin-top: 8px;background-color: #ebedf0;touch-action: pan-y;">
        <van-tabs v-model="active" animated swipeable>
          <van-tab title="精选">
            <div>
              <h2>内容1</h2>
            </div>
          </van-tab>
          <van-tab title="博客">
          </van-tab>
          <van-tab title="内容">
            <div>
              <h2>内容3</h2>
            </div>
          </van-tab>
          <van-tab title="相册">
            <div>
              <h2>内容4</h2>
            </div>
          </van-tab>
        </van-tabs>
      </div>
        <div v-if="active===1" style="background-color: #ebedf0;touch-action: pan-y" v-touch:swipe="swipeHandler">
          <single-blog  :show-follow-button="false" :show-remove-icon="!info.isSelf" :blog-val="blog" v-for="(blog) in blogs" :key="blog.id"/>
        </div>
    </div>
    <div class="self-homepage-nav-bottom" v-if="!info.isSelf">
      <div>
        <router-link :to="'/chat/userChat/' + info.id">
          <div><i class="icon-cc-chat iconfont nav-bottom-icon" style="margin-left: 2px"></i></div>
          <div><span class="nav-bottom-span-text">私信</span></div>
        </router-link>
      </div>
      <div v-if="relation===50003" @click="show=true">
        <i class="icon-huxiangguanzhuren iconfont nav-bottom-icon" style="margin-left: 12px"></i>
        <div><span class="nav-bottom-span-text">互相关注</span></div>
      </div>
      <div v-else-if="relation===50002" @click="show=true">
        <i class="icon-yiguanzhuren iconfont nav-bottom-icon" style="margin-left: 6px"></i>
        <div><span class="nav-bottom-span-text">已关注</span></div>
      </div>
      <div v-else-if="relation===50000" @click="addFollow">
        <van-button  color="orange" icon="plus" round size="small" style="width: 135px;height: 40px;margin-top: 3px">关注</van-button>
      </div>
      <div v-else-if="relation===50001" @click="addFollow">
        <van-button  color="orange" icon="plus" round size="small" style="width: 135px;height: 40px;margin-top: 3px">回关</van-button>
      </div>
      <div>
        <i style="color: #646566;font-size: 1.05rem;margin-left: 12px;position: relative;top: 5px" class="icon-arrowup iconfont"></i>
        <div><span class="nav-bottom-span-text">相关推荐</span></div>
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
import SingleBlog from '@/components/Blog/SingleBlog'
import { Dialog, Toast } from 'vant'

export default {
  name: 'personal-homepage',
  props: ['id'],
  components: {
    'single-blog': SingleBlog
  },
  data () {
    return {
      blogs: null,
      info: null,
      iconChange: 1,
      active: 1,
      relation: null,
      show: false,
      actions: [{ name: '设为特别关注' }, { name: '设置分组' }, { name: '设置备注' }, { name: '取消关注', color: 'red' }]
    }
  },
  created () {
    this.getPersonalData()
    this.getBlog()
  },
  mounted () {
    // 动态的监听窗口的变化从而进行样式的控制
    window.onscroll = () => {
      const scrollTop = document.documentElement.scrollTop
      const backgroundHeight = this.$refs.backgroundImage.clientHeight
      if (scrollTop > backgroundHeight - 48) {
        document.getElementById('navbar').classList.remove('opacity-style')
        document.getElementById('navbar').classList.add('opacity-style-deep')
      } else {
        document.getElementById('navbar').classList.remove('opacity-style-deep')
        document.getElementById('navbar').classList.add('opacity-style')
      }
    }
  },
  methods: {
    // 弹起actionSheet面板根据用户的选择来执行不同的操作
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
        const { data: res } = await this.$http.post('/friends/' + this.id, {}, this.$store.state.headers)
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
      const { data: res } = await this.$http.delete('/friends/' + this.id, this.$store.state.headers)
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
    },
    // 判断屏幕的左右滑动事件从而进行标签页展示的切换
    swipeHandler (direction) {
      if (direction === 'right') this.active--
      else if (direction === 'left') {
        this.active++
      }
    },
    // 得到个人信息
    async getPersonalData () {
      const { data: res } = await this.$http.get('/users/' + this.id, this.$store.state.headers)
      if (res.code === 20000) this.$router.push({ path: '/homepage' })
      else {
        res.data.avatar = this.$baseUrl + 'static/upload/' + res.data.avatar
        this.info = res.data
        console.log(this.info)
      }
      // 如果不是自己查看自己的主页则去查询关系
      if (!this.info.isSelf) {
        const { data } = await this.$http.get('/friends/' + this.id, this.$store.state.headers)
        this.relation = data.code
        console.log(data)
      }
    },
    // 得到个人的博客信息
    async getBlog () {
      const { data: res } = await this.$http.get('/blogs/users/' + this.id, this.$store.state.headers)
      this.blogs = res.data
      console.log(res)
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.nav-bottom-icon {
  color: #646566;
  font-size: 1.2rem;
  position: relative;
  top: 5px;
}

.nav-bottom-span-text {
  color: #646566;
  font-size: 0.7rem;
}

.self-homepage-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}

.opacity-style {
  opacity: 0.4;
}

.opacity-style-deep {
  opacity: 1;
}

.self-homepage-main {
  background-color: white;

  .self-homepage-fans-follow {
    display: flex;
  }

  .self-homepage-intro {
    padding: 0 15px;
  }
}

.self-homepage-nav-bottom {
  height: 46px;
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  background-color: white;
  border-top: 1px solid #ebedf0;
  display: flex;
  justify-content: space-evenly;
}
</style>
