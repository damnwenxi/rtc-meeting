<!--
 * @Author: your name
 * @Date: 2020-02-22 13:22:22
 * @LastEditTime : 2020-04-07 21:50:28
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/App.vue
 -->
<template>
  <v-app>
    <NavBar />
    <div id="container" class>
      <router-view @tip="appTip($event)"></router-view>
    </div>

    <!-- 全局tip -->
    <v-snackbar v-model="snackbar" :color="color" bottom :timeout="timeout">
      {{ tip }}
      <v-btn dark text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar'
export default {
  name: 'App',

  components: {
    NavBar
  },

  data: () => ({
    snackbar: false, // 全局tip
    tip: '', // 通知内容
    timeout: 3000,
    color: 'info'
  }),

  methods: {
    appTip(data) {
      this.color = this.getTipColor(data.code)
      this.tip = data.msg
      this.snackbar = true
    },
    getTipColor(code) {
      switch (code) {
        case 0:
          return 'success'
          break

        case -1:
          return 'error'
          break

        case 1:
          return 'cyan darken-2'
          break

        default:
          return 'info'
          break
      }
    }
  },

  created() {
    window.trace = text => {
      text = text.trim()
      const now = (window.performance.now() / 1000).toFixed(3)
      console.log(now, text)
    }
    // 根据token中的信息先登录
    let user = window.localStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      console.log(user)
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  position: absolute;
  width: 100%;
  top: 56px;
  bottom: 0;
}
</style>
