<template>
  <div>
    <router-link to="/personalInfo" v-if="status">
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
    <router-link to="/login" v-else>
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
      status: false
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
      } else {
        Toast('请先登录')
        location.href = this.$homepageLocation + 'login'
      }
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
  background-color: white;
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
