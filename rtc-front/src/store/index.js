/*
 * @Date         : 2020-03-06 23:09:14
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-05 15:21:34
 * @FilePath     : /rtc-meeting/rtc-front/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    updateUser(state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user || ''))
    }
  },
  getters: {
    user: state => {
      return state.user
    }
  },
  actions: {

  },
  modules: {
  }
})
