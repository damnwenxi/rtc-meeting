<!--
 * @Author: kefeng
 * @Date: 2020-02-22 21:43:49
 * @LastEditTime: 2020-02-23 23:46:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/components/NavBar.vue
 -->
<template>
  <v-app-bar absolute color="white" hide-on-scroll scroll-target="#container">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-toolbar-title>RTC meeting</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {}
</script>

<style>
</style>