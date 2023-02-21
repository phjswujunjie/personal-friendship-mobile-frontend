<template>
  <div v-if="groupInfo">
    <div>
      <van-nav-bar
        title="群聊设置"
        left-text="返回"
        right-text="按钮"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        style="position: fixed;left: 0;width: 100%;top: 0"
      >
        <template #right>
          <van-icon name="share" size="18"/>
        </template>
      </van-nav-bar>
    </div>
    <div style="padding: 10px;margin-top: 13vw">
      <div style="background-color: white;border-radius: 5px">
        <router-link class="group-info-group-homepage" :to="'/g/' + id">
          <div class="group-info-group-avatar">
            <van-image
              width="50px"
              height="50px"
              radius="5px"
              fit="cover"
              :src="groupInfo.groupAvatar"
            />
          </div>
          <div class="group-info-group-name">
            <span style="display: block;color: black;font-weight: bold;padding-bottom: 5px">{{groupInfo.groupName }}</span>
            <span style="font-size: 0.75rem;color: #969799">{{groupInfo.groupIntroduction === '' ? '暂无介绍' : groupInfo.groupIntroduction}}</span>
          </div>
          <div>
            <van-icon name="arrow" style="line-height: 54px" color="#969799"/>
          </div>
        </router-link>
      </div>
      <div style="background-color: white;margin-top: 8px;border-radius: 5px;padding: 10px">
        <div style="display: flex;">
          <div style="flex-grow: 1;font-size: 1.25rem">
            群聊成员
          </div>
          <div style="color: #969799">
            共{{groupInfo.groupMemberNumber}}人
            <van-icon name="arrow" color=" #969799"/>
          </div>
        </div>
        <div style="margin-top: 5px">
          <van-grid :column-num="5" :border="false">
            <van-grid-item v-for="member in groupMember" :key="member.userId"
                           :text="member.nickname.length > 4 ? member.nickname.substring(0, 3) + '...' : member.nickname"
                           :to="'/u/' + member.userId">
              <template #icon>
                <van-image
                  width="35px"
                  radius="5px"
                  height="35px"
                  fit="cover"
                  :src="member.avatar"
                />
              </template>
            </van-grid-item>
            <van-grid-item text="邀请" to="/to" icon="add" style="color: #969799">
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <div style="margin-top: 10px">
        <div>
          <span style="font-size: 0.85rem;color: #969799">群聊信息</span>
        </div>
        <div style="border-radius: 5px;background-color: white">
          <van-cell title="群聊名称" is-link :value="groupInfo.groupName" />
          <van-cell title="群号" is-link :value="groupInfo.groupId" />
          <van-cell title="群公告" is-link :value="groupInfo.groupNotice === '' ? '暂无公告' : groupInfo.groupNotice" />
          <van-cell title="我的本群昵称" is-link :value="groupInfo.selfNickname === '' ? '未设置' : groupInfo.selfNickname" />
          <van-cell title="群聊备注" is-link :value="groupInfo.groupNote === '' ? '未设置' : groupInfo.groupNote" />
        </div>
      </div>
      <div style="background-color: white;font-size: 1.15rem;color: orangered;
      margin-top: 8px;height: 50px;border-radius: 5px;text-align: center;line-height: 50px" @click="exitGroup">
        <span>退出该群</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'group-info',
  props: ['id'],
  data () {
    return {
      groupInfo: null,
      groupMember: null
    }
  },
  created () {
    this.getGroupSettingData()
  },
  methods: {
    async getGroupSettingData () {
      const { data: res } = await this.$http.get('/groups/setting/' + this.id, this.$store.state.headers)
      if (res.code === 20001) {
        this.groupInfo = res.data[0]
        console.log(this.groupInfo)
        res.data.splice(0, 1)
        this.groupMember = res.data
      }
    },
    // 退出群聊的操作
    async exitGroup () {
      const { data: res } = await this.$http.delete('/userGroupRelations/' + this.groupInfo.id, this.$store.state.headers)
      if (res.code === 21001) {
        Toast.success(res.msg)
        this.$router.replace('/chatFront/index')
      } else {
        Toast.fail(res.msg)
      }
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    // 跳转到群的信息页面
    onClickRight () {
      console.log('right')
    }
  }
}
</script>

<style scoped lang="less">
.group-info-group-homepage {
  display: flex;
  background-color: white;
  padding: 5px 20px 2px 15px;
  border-radius: 5px;

  .group-info-group-name {
    flex-grow: 1;
    margin-left: 10px;
  }
}
</style>
