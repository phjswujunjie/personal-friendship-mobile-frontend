<template>
  <div>
    <div>
      <van-nav-bar
        title="个人信息"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      />
    </div>
    <div v-if="info">
      <label for="photo-input">
        <van-cell title="头像" is-link size="large">
          <template #right-icon>
            <van-image
              width="50"
              height="50"
              :src="info.avatar"
              radius="5px"
            />
          </template>
        </van-cell>
      </label>
      <van-cell title="昵称" is-link :value="info.nickname" to="/changeNickname"/>
      <van-cell title="账号" is-link :value="info.account" to="/changeAccount"/>
      <van-cell title="性别" is-link :value="info.gender" to="/changeGender"/>
      <van-cell title="地区" is-link :value="info.address" to="/changeArea"/>
      <van-cell title="个性签名" is-link :value="info.introduction" to="/changeIntroduction"/>
      <input type="file" accept="image/*" style="display: none" id="photo-input" @change="photoEdit">
    </div>
    <div>
      <van-overlay :show="show">
        <div class="wrapper">
          <img src="" id="photo" ref="photo" alt="图片" style="width: 100%;height: 100%">
        </div>
        <div class="edit-photo-icon">
          <div @click="show = false" style="color: white;margin-left: 10px"><span>取消</span></div>
          <div @click="cropper.rotate(-90)"><i class="iconfont icon-rotate-left" style="color: white;font-size: 1.5rem"></i></div>
          <div style="margin-right: 10px;margin-bottom:5px" @click="uploadAvatar"><van-button type="primary" size="small">确定</van-button></div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import { Notify, Toast } from 'vant'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'personal-info',
  data () {
    return {
      info: null,
      status: false,
      show: false,
      cropper: null
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.cropper = new Cropper(document.getElementById('photo'), {
      aspectRatio: 1,
      viewMode: 1,
      preview: '.small',
      dragMode: 'move',
      background: false,
      modal: false,
      movable: false,
      checkCrossOrigin: false
    })
  },
  methods: {
    async uploadAvatar () {
      const data = new FormData()
      data.append('avatar', this.cropper.getCroppedCanvas().toDataURL('image/png'))
      const { data: res } = await this.$http.put('/users/avatars', data, this.$store.state.headers)
      if (res.code === 22001) {
        this.info.avatar = this.$baseUrl + '/static/upload/' + res.data
        this.show = false
      } else if (res.code === 30000) {
        Notify({ type: 'danger', message: '您的账号在别处进行了登录!!' })
      } else {
        Notify({ type: 'danger', message: '发生错误, 请重试!!' })
      }
    },
    // 当文件框变化时改变头像的地址
    async photoEdit (e) {
      this.show = true
      this.$refs.photo.src = window.URL.createObjectURL(e.target.files[0])
      this.cropper.replace(window.URL.createObjectURL(e.target.files[0]))
      e.target.value = ''
    },
    // 得到数据
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
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
}

.edit-photo-icon {
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  z-index: 2;
}

/deep/ .cropper-container {
  margin-top: 120px;
}
</style>
