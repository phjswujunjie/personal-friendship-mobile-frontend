import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.less'
import axios from 'axios'
import EmojiSelector from 'vue-emoji-selector'
import 'vue-emoji-selector/lib/vue-emoji-selector.css'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont1.css'
import '@/assets/icon/iconfont2.css'
import '@/assets/icon/iconfont.ttf'
import 'vue2-animate/dist/vue2-animate.min.css'
// 使用插件来判断移动端的屏幕左滑和右滑事件
import Vue2TouchEvents from 'vue2-touch-events'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(EmojiSelector)
Vue.use(Vue2TouchEvents)

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
