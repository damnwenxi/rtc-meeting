/*
 * @Date         : 2020-03-06 23:09:14
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-07 22:18:58
 * @FilePath     : /rtc-meeting/rtc-front/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户
    loginUser: null,
    // 临时用户
    user: null
  },
  mutations: {
    updateLoginUser(state, user) {
      state.loginUser = user
      window.localStorage.setItem('user', JSON.stringify(user || ''))
    },
    updateUser(state, user) {
      state.user = user
    }
  },
  getters: {
    loginUser: state => {
      return state.loginUser
    },
    user: state => {
      return state.user
    }
  },
  actions: {

  },
  modules: {
  }
})
