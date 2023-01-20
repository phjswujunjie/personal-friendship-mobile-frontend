import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chatFront',
    component: () => import('@/views/Chat/ChatFront')
  },
  {
    path: '/login',
    component: () => import('@/views/LoginSystem/Login')
  },
  {
    path: '/register',
    component: () => import('@/views/LoginSystem/Register')
  },
  {
    path: '/chat/userChat/:id',
    component: () => import('@/views/Chat/ChatWithOther')
  },
  {
    path: '/personal',
    component: () => import('@/views/Personal/Personal')
  },
  {
    path: '/setting',
    component: () => import('@/views/Personal/setting/SettingPage')
  },
  {
    path: '/personalInfo',
    component: () => import('@/views/Personal/changePersonalInfo/PersonalInfo')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
