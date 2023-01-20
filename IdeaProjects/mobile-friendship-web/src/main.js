import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.less'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(Vant)

axios.defaults.baseURL = 'http://localhost:8888'
Vue.prototype.$http = axios
// 设置一个常量, 用来在vue实例中方便的对图片的地址进行统一的处理
Vue.prototype.$baseUrl = 'http://localhost:8888/'
// 设置一个常量, 用来在vue实例中方便的对用户的主页地址进行统一的处理
Vue.prototype.$homepageLocation = 'http://localhost:8082/'
// 设置一个常量, 用来在vue实例中websocket的url
Vue.prototype.$webSocketUrl = 'ws://localhost:8888/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
