<!--
 * @Author: kefeng
 * @Date: 2020-02-22 21:43:49
 * @LastEditTime: 2020-03-26 23:38:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/components/NavBar.vue
 -->
<template>
  <v-app-bar absolute color="white" hide-on-scroll scroll-target="#container">
    <v-icon @click="goHome()">mdi-domain</v-icon>
    <v-toolbar-title class="title">RTC meeting</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn @click="goLogin()" v-if="!isLogin" text>
      <v-icon dark>mdi-account-circle</v-icon>登录
    </v-btn>

    <v-menu
      v-else
      v-model="userMenu"
      :close-on-click="true"
      :close-on-content-click="true"
      :offset-y="true"
    >
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-avatar size="36px">
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>
          <strong v-html="'kefeng'"></strong>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout()">
          退出登录
          <v-icon>mdi-export</v-icon>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      userMenu: false,
      isLogin: false
    }
  },
  methods: {
    logout() {
      console.log('logout')
    },
    goLogin() {
      this.$router.push({
        name: 'Login'
      })
    },
    goHome() {
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-left: 10px;
}
</style>