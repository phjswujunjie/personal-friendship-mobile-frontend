<template>
  <div>
    <div>
      <input type="file" @change="fileUpload" id="fileUpload" multiple style="display: none" accept=".gif,.png,.jpg,.jpeg,.mp4">
    </div>
    <div class="create-blog-div">
      <div>
        <van-nav-bar
          title="发博客"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
          style="background-color: #ebedf0;"
        >
          <template #right v-if="content !== '' || fileList.length !== 0">
            <van-button type="primary" size="small" @click="submit">发布</van-button>
          </template>
          <template #right v-else>
            <van-button type="primary" disabled size="small">发布</van-button>
          </template>
        </van-nav-bar>
      </div>
      <div style="flex-grow: 1;display: flex;flex-direction: column;overflow: auto" @click="inputBlogContent">
        <div style="flex-grow: 1;max-height: 30vw">
          <textarea @focus="showFocus" ref="textArea" v-model="content" class="blog-input" placeholder="分享新鲜事..."></textarea>
        </div>
        <div v-if="fileList.length !== 0" style="display: flex;flex-wrap: wrap;max-height: 80vw">
          <div @click="displayImage" :pos="index" class="upload-file-wrapper-div" v-for="(src, index) in fileSrc" :key="src">
            <van-icon name="cross" @click.stop="removeFile" class="remove-file-icon" :id="index"/>
            <van-image
              width="30vw"
              height="30vw"
              fit="cover"
              :src="src"
              :pos="index"
            />
          </div>
          <label for="fileUpload" class="file-upload-image-label">
            <van-icon name="plus" id="file-upload-icon"/>
          </label>
        </div>
      </div>
      <div class="blog-media-icon-div">
        <div>
          <label for="fileUpload" id="label">
            <van-icon name="photo-o"/>
          </label>
        </div>
        <div>
          <van-icon name="smile-o" @click="clickEmoji"/>
        </div>
      </div>
      <div class="emoji-div" v-if="showEmojiFlag === 1">
        <EmojiSelector style="height: 100%;width: 100%" @select="selectEmoji"/>
        <div class="remove-emoji-div" @click="removeEmoji">
          <van-icon name="clear" size="1.5rem" color="lightgray" style="margin-left: 1.75vh;margin-top: 0.75vh"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, ImagePreview, Notify, Toast } from 'vant'

export default {
  name: 'create-blog',
  async created () {
    // 在Vue实例创建的时候发送异步请求将token作为请求头带去后端看用户是否登录
    const { data: res } = await this.$http.post('/loginOrOut', {}, this.$store.state.headers)
    // 如果没有登录,则提醒登录
    if (res.code !== 30001) {
      Dialog.alert({
        title: '提示',
        message: '请先进行登录'
      })
      this.$router.push({ path: '/login' })
    }
  },
  data () {
    return {
      // 博客内容
      content: '',
      // 控制表情框的展示
      showEmojiFlag: -1,
      // 上传的文件对象
      fileList: [],
      // 上传的文件生成的src地址
      fileSrc: [],
      // 博客的权限设置
      isPublic: 4,
      // 上传的最大文件数量
      maxSize: 9
    }
  },
  methods: {
    showFocus (e) {
      e.preventDefault()
    },
    // 向服务器提交创建的博客信息
    async submit () {
      this.content = this.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
      const data = new FormData()
      for (const i of this.fileList) {
        data.append('files', i)
      }
      data.append('text', this.content)
      data.append('isPublic', this.isPublic)
      const { data: res } = await this.$http.post('/blogs', data, {
        headers: {
          token: window.localStorage.getItem('token')
        },
        onUploadProgress (e) {
          console.log(e)
        }
      })
      if (res.code === 23001) {
        // 发布成功
        Toast.success('发布成功')
        this.$router.push({ path: '/homepage/follow' })
      } else if (res.code === 30000) {
        // 登录状态失效, 发布失败
        Dialog.alert({
          title: '提示',
          message: '请先进行登录'
        })
      } else {
        // 未知状态发布失败
        Dialog.alert({
          title: '提示',
          message: '发布失败'
        })
      }
    },
    // 删除预览的图片
    removeFile (e) {
      console.log(e.target.id)
      this.fileSrc.splice(e.target.id, 1)
      this.fileList.splice(e.target.id, 1)
    },
    // 预览图片
    displayImage (e) {
      ImagePreview({
        images: [
          ...this.fileSrc
        ],
        startPosition: Number(e.target.parentNode.getAttribute('pos'))
      })
    },
    // input框触发change时处理文件
    fileUpload (e) {
      const files = e.target.files
      for (const i of files) {
        if (this.fileList.length === 9) {
          Notify({ type: 'warning', message: '上传的最大文件数量不能超过9个' })
          return
        }
        this.fileList.push(i)
        this.fileSrc.push(window.URL.createObjectURL(i))
      }
      e.target.value = ''
    },
    // 点击表情框里的删除icon后对字符进行相应的删除
    removeEmoji () {
      // 记录光标的位置
      const start = this.$refs.textArea.selectionStart
      // 记录光标前面的内容
      const beforeContent = this.content.substring(0, start)
      // 记录光标后面的内容
      const afterContent = this.content.substring(start, this.content.length)
      // 利用for...of来统计字符的真正个数
      let index = 0
      /* eslint-disable no-unused-vars */
      for (const i of beforeContent) {
        index++
      }
      /* eslint-enable no-unused-vars */
      let newContent = ''
      // 用来辅助获取到光标前面的内容(剔除了最后一个字符)
      let j = 1
      let len = 0
      for (const i of beforeContent) {
        // 对字符进行拼接
        if (j < index) {
          newContent += i
          j++
        } else {
          // 统计最后删除的字符的长度用来后面设置光标的位置
          len = i.length
        }
      }
      // 合并成新的内容
      this.content = newContent + afterContent
      // // 更新后设置光标
      this.$nextTick(() => {
        this.$refs.textArea.setSelectionRange(start - len, start - len)
      })
      // 得到焦点
      this.stopKeyboard()
    },
    // 点击输入框时把emoji框隐藏
    inputBlogContent () {
      this.showEmojiFlag = -1
    },
    // 当点击表情进行输入时触发的操作
    selectEmoji (item) {
      // 记录光标的位置
      const start = this.$refs.textArea.selectionStart
      // 将表情插入到文字中
      this.content = (this.content.substring(0, start) + item.char + this.content.substring(start, this.content.length))
      this.stopKeyboard()
      // // 等content内容更新完毕后, 将光标设置到所添加的表情的后面
      this.$nextTick(() => {
        this.$refs.textArea.setSelectionRange(start + item.char.length, start + item.char.length)
      })
    },
    // 唤起表情框
    clickEmoji () {
      if (this.showEmojiFlag === 1) {
        // 为1则代表要隐藏表情框, 这时我们唤起移动端的键盘
        this.$refs.textArea.focus()
      } else {
        // 为-1则表示要唤起表情框, 这时我们拒绝唤起移动端的键盘
        this.stopKeyboard() // 这里我们是想拒绝唤起键盘
      }
      this.showEmojiFlag *= -1
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    // 用于在移动端textarea框得到焦点后禁止弹起键盘
    stopKeyboard () {
      this.$refs.textArea.setAttribute('readonly', 'readonly')
      this.$refs.textArea.focus()
      setTimeout(() => {
        this.$refs.textArea.removeAttribute('readonly')
      })
    }
  }
}
</script>

<style scoped lang="less">
//
.create-blog-div {
  background-color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .blog-input {
    border: none;
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    resize: none;
  }

  .blog-media-icon-div {
    display: flex;
    justify-content: space-evenly;
    font-size: 1.5rem;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #ebedf0;
  }
}

.emoji-div {
  height: 30vh;

  .remove-emoji-div {
    width: 7vh;
    height: 5vh;
    background-color: #ebedf0;
    position: fixed;
    bottom: 6px;
    right: 40px;
    border-radius: 5px;
  }
}

.upload-file-wrapper-div {
  position: relative;
  margin-left: 2vw;
}

.file-upload-image-label {
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

.remove-file-icon {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2000;
  background-color: lightgray;
  border-radius: 8px;
  opacity: 0.5;
}

/deep/ .emoji-panel {
  display: flex;
  flex-direction: column;
  background-color: #ebedf0;
}

/deep/ .emoji-box {
  flex-grow: 1;
  overflow: auto;
}

/deep/ .emoji-footer {
  height: 5vh;
  position: relative;
}
</style>
