<!--  单个博客的完整组件  -->
<!--
  一个组件对象最少包含: 博客id: id, 博客拥有者id: userId, 拥有者头像: userAvatar, 创建时间: createTime, 内容: content
  图像资源: image, 视频资源: video, 权限控制: isPublic, 拥有者主页地址: userUrl, 点赞数: loveUserNumber, 点赞的人: loveUser,
  回复数量: commentNumber,
  拥有者昵称: userNickname, 当前用户的登录状态: loginStatus, 当登录后还应拥有isLike(当前用户是否点赞该博客), relation(当前用户与博客
  拥有者之间的关系), isSelf(博客是否属于自己, 此值为false才会有relation属性)
-->
<template>
  <div class="single-blog">
    <!--  博客头部区域  -->
    <div class="single-blog-header">
      <!--  头像区域    -->
      <div class="blog-avatar">
        <a :href="blog.userUrl">
          <van-image
            width="40"
            height="40"
            radius="5px"
            :src="blog.userAvatar"
          />
        </a>
      </div>
      <!--   展示昵称和发布时间的区域   -->
      <div class="blog-nickname-time">
        <div>
          <span style="color: orange;font-size: 1rem">{{ blog.userNickname }}</span>
        </div>
        <div style="margin-top: 2px">
          <span style="color: #969799;font-size: 0.75rem">{{blog.createTime | adjustDateFormat}}</span>
        </div>
      </div>
      <!--   展示按钮的区域   -->
      <div class="blog-follow-button" v-if="showFollowButton && !blog.isSelf && blog.relation !==0">
        <van-button v-if="blog.relation===50000" @click="addFollow" color="orange" icon="plus" plain round size="small" style="width: 65px">关注</van-button>
        <van-button v-else-if="blog.relation===50001" @click="addFollow" color="orange" icon="plus" plain round size="small" style="width: 65px">回关</van-button>
      </div>
      <div v-if="showOperateButton">
        <!--   各种对博客操作的区域     -->
        <span v-if="showRemoveIcon">
          <van-icon name="cross" color="lightgray" @click="removeBlog" style="margin-left: 18px;font-size: 1.25rem"/>
        </span>
        <div v-if="!showRemoveIcon">
          <van-icon @click="showActionSheet = true" name="arrow-down" color="lightgray" style="margin-left: 18px;font-size: 1.25rem"/>
        </div>
      </div>
    </div>
    <!--  博客内容区域  -->
    <div class="single-blog-content">
      <div class="blog-content">
        {{blog.content}}
      </div>
      <div class="blog-media">
        <div class="blog-media-wrap-div" v-for="(image, index) in blog.image" :key="image">
          <van-image
            v-if="image !== $baseUrl + 'static/upload/'"
            width="30vw"
            height="30vw"
            fit="cover"
            :src="image"
            @click="displayImage"
            :pos="index"
          />
        </div>
      </div>
    </div>
    <!--  博客脚部区域  -->
    <div v-if="showFooter" class="single-blog-footer">
      <div>
        <van-icon name="comment-o" size="1.25rem" style="position: relative;top:2px"/>
        <span class="icon-number">20</span>
      </div>
      <router-link :to="'/blogComment/' + blog.id" style="color: #646566">
        <van-icon name="comment-o" size="1.25rem" style="position: relative;top:2px" :blogId="blog.id"/>
        <span class="icon-number" >{{ blog.commentNumber===0? '' :blog.commentNumber }}</span>
      </router-link>
      <div @click="createLikes" :class="{ 'likeStyle': blog.isLike === 1}">
        <van-icon name="good-job-o" size="1.25rem"/>
        <span class="icon-number">{{ blog.loveUserNumber===0 ?'':blog.loveUserNumber }}</span>
      </div>
    </div>
    <div  v-if="!showRemoveIcon">
      <van-action-sheet
        v-model="showActionSheet"
        :actions="actions"
        cancel-text="取消"
        @select="operateSelect"
        close-on-click-action
      />
    </div>
  </div>
</template>

<script>
import { Dialog, ImagePreview, Toast } from 'vant'

export default {
  name: 'single-blog',
  props: {
    // 博客对象
    blogVal: {
      required: true
    },
    // 是否展示关注按钮
    showFollowButton: {
      required: true
    },
    // 是否展示icon
    showRemoveIcon: {
      required: true
    },
    // 是否展示博客的底部区域
    showFooter: {
      default: true
    },
    // 是否展示removeIcon或者arrowIcon, 等级高于showRemoveIcon
    showOperateButton: {
      default: true
    }
  },
  created () {
    // 处理要预览的图像地址信息
    this.images = []
    for (const i of this.blog.image) {
      if (i !== this.$baseUrl + 'static/upload/') {
        this.images.push(i)
      }
    }
  },
  data () {
    return {
      blog: this.blogVal,
      showActionSheet: false,
      images: null,
      actions: [
        { name: '置顶' },
        { name: '删除', color: 'red' }
      ]
    }
  },
  filters: {
    adjustDateFormat (val) {
      return val.substring(2, 16)
    }
  },
  methods: {
    // 点击关注别人后触发的事件
    async addFollow () {
      // 没有登录则提示用户登录
      if (!this.blog.loginStatus) {
        Dialog.alert({
          title: '提示',
          message: '请先进行登录'
        })
      } else {
        // 登录后则进行关注的操作
        const { data: res } = await this.$http.post('/friends/' + this.blog.userId, {}, this.$store.state.headers)
        if (res.code === 23001) {
          this.blog.relation = 0
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
    // 处理点赞信息
    createLikes () {
      if (!this.blog.loginStatus) {
        Dialog.alert({
          title: '提示',
          message: '请先进行登录'
        })
        return
      }
      if (this.blog.isLike === 0) {
        // 将此博客的是否点赞设置为1(用户已点赞)
        this.blog.isLike = 1
        // 将此博客的点赞数加1
        this.blog.loveUserNumber += 1
        Toast.success('点赞成功')
      } else {
        this.blog.isLike = 0
        this.blog.loveUserNumber -= 1
      }
      const data = new URLSearchParams()
      // 博客的id
      data.append('blogId', this.blog.id)
      // 进行的操作, 1为增加点赞信息, 0为删除点赞信息
      data.append('flag', this.blog.isLike)
      // 将操作点赞的信息发给后端, 进而对数据库中的点赞信息进行操作
      this.$http.post('/likes/blog', data, this.$store.state.headers)
    },
    // 点击不感兴趣的图标后屏蔽此博客对该用户的推送
    removeBlog (e) {
      e.target.parentNode.parentNode.parentNode.parentNode.style.transform = 'translate(-100%)'
      e.target.parentNode.parentNode.parentNode.parentNode.style.transition = 'all 0.5s'
      setTimeout(() => {
        e.target.parentNode.parentNode.parentNode.parentNode.remove()
      }, 500)
    },
    operateSelect (item) {
      console.log(item.name)
      console.log(this.blog.id)
    },
    displayImage (e) {
      // 图片预览
      ImagePreview({
        images: [
          ...this.images
        ],
        startPosition: Number(e.target.parentNode.getAttribute('pos'))
      })
    }
  }
}
</script>

<style scoped lang="less">
.single-blog {
  background-color: white;
  margin-top: 2vw;
  padding: 2vw;
}

.single-blog-header {
  display: flex;

  .blog-nickname-time {
    margin-left: 13px;
    flex-grow: 1;
  }

  .blog-follow-button {
    width: 23vw;
  }
}

.blog-content {
  word-break: break-all;
  margin: 5px 0;
}

.blog-media {
  display: flex;
  flex-wrap: wrap;

  .blog-media-wrap-div {
    margin-right: 1vw;
  }
}

.single-blog-footer {
  border-top: 1px solid #ebedf0;
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
  padding-top: 5px;
  font-weight: lighter;

  .icon-number {
    font-size: 1rem;
    margin-left: 5px;
  }
}

.likeStyle {
  color: orange;
}
</style>
