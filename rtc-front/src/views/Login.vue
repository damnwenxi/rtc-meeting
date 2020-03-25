<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:00
 * @LastEditTime: 2020-03-25 23:05:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/views/Login.vue
 -->
<template>
  <div class="login">
    <v-card class="login-card" max-width="1080" max-height="560">
      <v-img class="left-image" src="../assets/login-right.jpeg"></v-img>
      <v-form ref="loginForm" class="right-form" v-model="valid">
        <h1 class="login-title">登录</h1>
        <v-text-field
          v-model="username"
          :rules="nameRules"
          color="green"
          :counter="16"
          label="用户名/邮箱"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          color="green"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-1"
          label="密码"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-checkbox v-model="remember" label="记住我"></v-checkbox>

        <v-btn :disabled="!valid" color="success" class="mr-4" @click="login">登录</v-btn>

        <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>

        <div @click="goRegister()" class="register-tip">
          没有帐号，去注册
          <v-icon small clolo="#789">mdi-arrow-right</v-icon>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { login } from '../service/service'

export default {
  data() {
    return {
      username: '',
      password: '',
      remember: null,
      valid: false,
      showPassword: false,
      passwordRules: [
        v => !!v || '请输入密码',
        v => (v && v.length <= 16 && v.length >= 6) || '请输入6-16位密码'
      ],
      nameRules: [
        v => !!v || '请输入用户名/邮箱',
        v => /.+@.+\..+/.test(v) || '请输入格式正确的邮箱'
      ]
    }
  },
  methods: {
    login() {
      login({
        name: this.username,
        password: this.password
      }).then(res => {
        console.log(res)
      })
    },
    reset() {
      this.$refs.loginForm.reset()
    },
    goRegister() {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  .login-card {
    width: 60%;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    .left-image {
      width: 50%;
    }
    .right-form {
      padding: 30px;
      width: 50%;
      .login-title {
        color: #789;
      }
      .v-input {
        margin-top: 30px;
      }
      .register-tip {
        width: 100%;
        text-align: right;
        cursor: pointer;
        color: #789;
        font-size: 10px;
        margin-top: 20px;
      }
    }
  }
}
</style>