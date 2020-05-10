<!--
 * @Author: kefeng
 * @Date: 2020-02-22 21:43:49
 * @LastEditTime : 2020-05-10 09:30:33
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/components/NavBar.vue
 -->
<template>
  <v-app-bar id="top" absolute color="white" hide-on-scroll scroll-target="#container">
    <v-icon @click="goHome()">mdi-domain</v-icon>
    <v-toolbar-title class="title">RTC meeting</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn @click="goLogin()" v-if="!loginUser" text>
      <v-icon dark>mdi-account-circle</v-icon>登录
    </v-btn>

    <v-menu v-else :close-on-click="true" :close-on-content-click="true" :offset-y="true">
      <template v-slot:activator="{ on }">
        <span class="user-login" v-on="on">
          <v-avatar size="36px">
            <img src="../assets/img/avatar.png" v-real-src="loginUser.avatar" />
          </v-avatar>
          <span class="user-name" v-html="loginUser.name"></span>
        </span>
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
import { mapGetters, mapMutations } from 'vuex'
import defaultAvatar from '../assets/img/avatar.png'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['loginUser'])
  },
  methods: {
    ...mapMutations(['updateLoginUser']),
    logout() {
      this.updateLoginUser(null)
      window.localStorage.removeItem('jwt_token')
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
.user-login {
  cursor: pointer;
  color: #789;

  .user-name {
    margin-left: 6px;
  }
}
</style>