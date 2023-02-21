<template>
  <div>
    <div v-if="status" style="background-color: white">
      <router-link :to="homepageLocation">
        <div class="personal-info-outermost-div">
          <div class="personal-info-wrapper-div">
            <div class="personal-info-left-image">
              <van-image
                width="70"
                height="70"
                :src="info.avatar"
                radius="5px"
              />
            </div>
            <div class="personal-info-right-desc">
              <div class="personal-info-right-nickname">
                <span>{{info.nickname}}</span>
              </div>
              <div class="personal-info-right-account">
                <div style="display: inline-block">
                  <span >账号: {{info.account}}</span>
                </div>
                <div style="display: inline-block">
                  <van-icon name="arrow" style="padding-left:30vw;text-align: right"/>
                </div>
              </div>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </router-link>
      <van-grid :column-num="3">
        <van-grid-item>
          <template #icon>
            <i class="icon-wenzhangguanli iconfont" style="font-size: 25px;color: #969799"></i>
          </template>
          <template #text>
            <span style="color: #646566;font-size: 0.75rem">博客:<span style="color: black;font-weight: bolder">{{info.blogNumber}}</span></span>
          </template>
        </van-grid-item>
        <van-grid-item icon-prefix="icon-Following iconfont" to="/follower">
          <template #icon>
            <i class="icon-Following iconfont" style="font-size: 25px"></i>
          </template>
          <template #text>
            <span style="color: #646566;font-size: 0.75rem">关注:<span style="color: black;font-weight: bolder">{{info.followNumber}}</span></span>
          </template>
        </van-grid-item>
        <van-grid-item icon="user-o" to="/fans">
          <template #text>
            <span style="color: #646566;font-size: 0.75rem">粉丝:<span style="color: black;font-weight: bolder">{{info.fansNumber}}</span></span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
    <div v-else style="background-color: white">
      <router-link to="/login" >
        <div>
          <div class="personal-info-outermost-div">
            <div class="personal-info-wrapper-div">
              <div class="personal-info-left-image">
                <van-image
                  width="70"
                  height="70"
                  :src="$baseUrl + '/static/upload/unlogin.jpg'"
                  radius="5px"
                />
              </div>
              <div class="personal-info-right-desc">
                <div class="personal-info-login-text">
                  <span>点击登录</span>
                </div>
                <div class="personal-info-login-icon">
                  <van-icon name="arrow"/>
                </div>
                <div style="clear: both"></div>
              </div>
              <div style="clear: both"></div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <van-cell title="个人信息" icon="photo-o" style="margin-top: 10px" is-link to="/personalInfo" v-if="status"/>
    <van-cell title="个人信息" icon="photo-o" style="margin-top: 10px" is-link to="/login" v-else @click="tipLogin"/>
    <van-cell title="设置" icon="setting-o" style="margin-top: 10px" is-link to="/setting" v-if="status"/>
    <van-cell title="设置" icon="setting-o" style="margin-top: 10px" is-link to="/login" v-else @click="tipLogin"/>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'personal-info',
  components: {
  },
  data () {
    return {
      info: null,
      status: false,
      homepageLocation: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const { data: res } = await this.$http.get('/users', this.$store.state.headers)
      if (res.code === 20001) {
        res.data.avatar = this.$baseUrl + '/static/upload/' + res.data.avatar
        this.info = res.data
        this.status = true
        this.homepageLocation = '/u/' + this.info.id
      }
      console.log(res)
    },
    tipLogin () {
      Toast('请先登录')
    }
  }
}
</script>

<style scoped lang="less">
.personal-info-outermost-div {
  padding: 5vh 4vw 2vh 3vw;
}

.personal-info-left-image {
  width: 75px;
  float: left;
}

.personal-info-right-desc {
  float: left;
  margin-left: 10px;

  .personal-info-right-nickname {
    padding-top: 5px;
    font-weight: bolder;
    color: black;
  }

  .personal-info-right-account {
    padding-top: 23px;
    font-weight: lighter;
    color: #969799
  }

  .personal-info-login-text {
    margin-left: 20px;
    color: black;
    font-size: 20px;
    margin-top: 20px;
    font-weight: lighter;
    float: left;
  }

  .personal-info-login-icon {
    float: left;
    margin-top: 18px;
    font-size: 30px;
    color: #969799;
    margin-left: 30vw;
  }
}
</style>
