<!--
 * @Author: your name
 * @Date: 2020-02-22 13:22:22
 * @LastEditTime: 2020-03-06 21:44:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/App.vue
 -->
<template>
  <v-app>
    <NavBar />
    <div id="container" class>
      <router-view></router-view>
    </div>
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
    //
  }),

  created() {
    window.trace = text => {
      text = text.trim()
      const now = (window.performance.now() / 1000).toFixed(3)
      console.log(now, text)
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
