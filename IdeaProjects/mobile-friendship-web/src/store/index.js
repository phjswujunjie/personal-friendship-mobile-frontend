import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headers: {
      headers: {
        token: window.localStorage.getItem('token')
      }
    },
    status: false,
    info: null,
    replyInfo: null
  },
  getters: {
  },
  mutations: {
    setStatus (state, data) {
      state.status = data
    },
    setInfo (state, data) {
      state.info = data
    },
    setReplyInfo (state, data) {
      state.replyInfo = data
    }
  },
  actions: {
  },
  modules: {
  }
})
