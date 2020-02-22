<!--
 * @Author: your name
 * @Date: 2020-02-22 13:22:22
 * @LastEditTime: 2020-02-22 22:34:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/App.vue
 -->
<template>
  <v-app>
    <NavBar />
    <v-sheet id="container" class="overflow-y-auto">
      <v-container style="height: 1500px;">
        <router-view></router-view>
      </v-container>
    </v-sheet>
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
  })
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
