import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 登录模块的路由
const loginSystem = [
  {
    path: '/login',
    component: () => import('@/views/LoginSystem/Login')
  },
  {
    path: '/register',
    component: () => import('@/views/LoginSystem/Register')
  }
]

// 主页模块的路由(包含个人主页)
const homepage = [
  {
    path: '/homepage',
    component: () => import('@/views/Homepage/Homepage'),
    redirect: '/homepage/recommend',
    children: [
      {
        path: 'follow',
        component: () => import('@/views/Homepage/Follow/Follow')
      },
      {
        path: 'recommend',
        component: () => import('@/views/Homepage/Recommend/Recommend')
      }
    ]
  },
  {
    path: '/u/:id',
    component: () => import('@/views/Personal/personalHomepage/PersonalHomepage'),
    props: true
  }
]

// 聊天信息模块的路由
const chat = [
  // 创建群组的页面
  {
    path: '/createGroup',
    component: () => import('@/views/Group/CreateGroup')
  },
  // 群组聊天的页面
  {
    path: '/chat/group/:id',
    props: true,
    component: () => import('@/views/Chat/ChatWithGroup.vue')
  },
  // 群组设置的页面
  {
    path: '/chat/group/info/:id',
    props: true,
    component: () => import('@/views/Group/GroupInfo.vue')
  },
  // 群组主页的页面
  {
    path: '/g/:id',
    props: true,
    component: () => import('@/views/Group/GroupHomepage.vue')
  },
  {
    path: '/chatFront',
    component: () => import('@/views/Chat/ChatFront'),
    children: [
      {
        path: 'index',
        component: () => import('@/views/Chat/ChatFrontIndex.vue')
      },
      {
        path: 'notice',
        component: () => import('@/views/Chat/ChatFrontNotice.vue')
      }
    ]
  },
  {
    path: '/chat/userChat/:id',
    component: () => import('@/views/Chat/ChatWithOther')
  },
  {
    path: '/group/notice',
    component: () => import('@/views/Group/GroupNotice.vue')
  }
]

// 个人信息模块的路由
const personalInfo = [
  {
    path: '/personal',
    component: () => import('@/views/Personal/Personal')
  },
  {
    path: '/fans',
    component: () => import('@/views/Personal/friend/Fans')
  },
  {
    path: '/follower',
    component: () => import('@/views/Personal/friend/Follower')
  },
  {
    path: '/setting',
    component: () => import('@/views/Personal/setting/SettingPage')
  },
  {
    path: '/personalInfo',
    component: () => import('@/views/Personal/changePersonalInfo/PersonalInfo')
  },
  {
    path: '/changeGender',
    component: () => import('@/views/Personal/changePersonalInfo/ChangeGender')
  },
  {
    path: '/changeArea',
    component: () => import('@/views/Personal/changePersonalInfo/ChangeAddress')
  },
  {
    path: '/changeNickname',
    component: () => import('@/views/Personal/changePersonalInfo/ChangeNickname')
  },
  {
    path: '/changeIntroduction',
    component: () => import('@/views/Personal/changePersonalInfo/ChangeIntroduction')
  },
  {
    path: '/changeAccount',
    component: () => import('@/views/Personal/changePersonalInfo/ChangeAccount')
  }
]

// 博客模块系统
const blog = [
  {
    path: '/createBlog',
    component: () => import('@/views/Blog/CreateBlog/CreateBlog')
  },
  {
    path: '/blogComment/:id',
    props: true,
    component: () => import('@/views/Blog/BlogComment/BlogComment')
  }
]

// 搜索模块
const search = [
  {
    path: '/search',
    component: () => import('@/views/Search/Search')
  },
  {
    path: '/search/:condition',
    component: () => import('@/views/Search/SearchResult'),
    props: true
  }
]

// 网站的总路由
const routes = [
  ...loginSystem,
  ...homepage,
  ...chat,
  ...personalInfo,
  ...blog,
  ...search
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
