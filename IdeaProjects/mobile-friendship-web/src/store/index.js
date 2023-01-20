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
    info: null
  },
  getters: {
  },
  mutations: {
    setStatus (state, data) {
      state.status = data
    },
    setInfo (state, data) {
      state.info = data
    }
  },
  actions: {
  },
  modules: {
  }
})
