<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:10
 * @LastEditTime: 2020-03-27 22:48:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/views/Register.vue
 -->
<template>
  <div class="register">
    <v-card class="register-card" max-width="1080" max-height="560">
      <v-img class="left-image" src="../assets/login-right.jpeg"></v-img>
      <v-form ref="registerForm" class="right-form" v-model="valid">
        <h1 class="register-title">注册帐号</h1>
        <v-text-field
          v-model="username"
          :rules="nameRules"
          color="green"
          :counter="16"
          label="用户名"
          required
        ></v-text-field>

        <v-text-field v-model="email" :rules="emailRules" color="green" label="邮箱" required></v-text-field>

        <v-text-field
          v-model="password1"
          color="green"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="密码"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-text-field
          v-model="password2"
          color="green"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules2"
          :type="showPassword ? 'text' : 'password'"
          label="确认密码"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-btn :disabled="!valid" color="success" class="mr-4" @click="register">立即注册</v-btn>

        <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>

        <div @click="goLogin()" class="login-tip">
          已有帐号，去登录
          <v-icon small clolo="#789">mdi-arrow-right</v-icon>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { register } from '../service/service'

export default {
  data() {
    return {
      username: '',
      email: '',
      password1: '',
      password2: '',
      valid: false,
      showPassword: false,
      nameRules: [v => !!v || '请输入用户名'],
      emailRules: [
        v => !!v || '邮箱不得为空',
        v => /.+@.+\..+/.test(v) || '邮箱格式不正确'
      ],
      passwordRules: [
        v => !!v || '请输入密码',
        v => (v && v.length <= 16 && v.length >= 6) || '请输入6-16位密码'
      ],
      passwordRules2: [
        v => !!v || '请输入确认密码',
        v => this.password2 === this.password1 || '两次密码不一致'
      ]
    }
  },
  methods: {
    register() {
      register({
        name: this.username,
        email: this.email,
        password: this.password1
      }).then(res => {
        console.log(res)
        if (res.data && res.data.msg) {
          this.$emit('tip', {
            code: res.data.code,
            msg: res.data.msg
          })
        }
      })
    },
    reset() {
      this.$refs.registerForm.reset()
    },
    goLogin() {
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  .register-card {
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
      .register-title {
        color: #789;
      }
      .v-input {
        margin: 10px 0;
      }
      .login-tip {
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