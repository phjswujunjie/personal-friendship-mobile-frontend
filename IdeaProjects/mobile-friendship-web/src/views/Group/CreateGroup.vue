<template>
  <div>
    <div>
      <van-nav-bar
        title="新建群聊"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        style="background-color: #ebedf0"
      >
        <template #right>
          <van-button type="primary" size="small" @click="createGroup">创建</van-button>
        </template>
      </van-nav-bar>
    </div>
    <div>
      <van-cell-userGroup>
        <van-field v-model="groupName" label="群聊名" placeholder="请输入群聊名" />
      </van-cell-userGroup>
      <div style="margin: 5px">
        <span style="font-size: 1rem;">群聊头像:</span>
      </div>
      <div style="display: flex">
        <div v-if="avatar !== null" style="margin-left: 2vw;">
          <van-image
            @click="displayImage"
            width="30vw"
            height="30vw"
            fit="cover"
            :src="window.URL.createObjectURL(avatar)"
          />
        </div>
        <label for="fileUpload" class="userGroup-avatar">
          <van-icon name="plus" id="file-upload-icon"/>
        </label>
      </div>
    </div>
    <input accept="image/*" type="file" id="fileUpload" style="display: none" @change="groupAvatarUpload">
  </div>
</template>

<script>
import { ImagePreview, Toast } from 'vant'

export default {
  name: 'create-userGroup',
  data () {
    return {
      groupName: '',
      window: window,
      avatar: null
    }
  },
  methods: {
    async createGroup () {
      if (this.avatar && this.groupName !== '') {
        const data = new FormData()
        data.append('groupName', this.groupName)
        data.append('avatar', this.avatar)
        const { data: res } = await this.$http.post('/groups', data, this.$store.state.headers)
        if (res.code === 23001) {
          Toast.success('创建成功')
          this.$router.push('/chat/group/' + res.data)
        }
      } else {
        Toast('请输入创建群聊必备的信息')
      }
    },
    groupAvatarUpload (e) {
      this.avatar = e.target.files[0]
    },
    displayImage () {
      ImagePreview({
        images: [
          window.URL.createObjectURL(this.avatar)
        ]
      })
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.userGroup-avatar {
  width: 30vw;
  height: 30vw;
  margin-left: 2vw;
  box-sizing: border-box;
  border: 1px lightgray dashed;
}

#file-upload-icon {
  font-size: 15vw;
  font-weight: lighter;
  color: #969799;
  margin: 7vw;
}
</style>
