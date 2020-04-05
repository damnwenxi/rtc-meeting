/*
 * @Date         : 2020-03-06 23:09:14
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-05 16:03:14
 * @FilePath     : /rtc-meeting/rtc-front/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// 自定义图片加载失败指令
Vue.directive('real-src', function (el, binding) {
  let imgUrl = binding.value
  new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => {
      return resolve
    }
    img.onerror = () => {
      return reject
    }
    img.src = imgUrl
  }).then(() => {
    el.setAttribute('src', imgUrl)
  })
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
