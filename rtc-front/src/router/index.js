/*
 * @Author: your name
 * @Date: 2020-02-22 13:22:22
 * @LastEditTime: 2020-03-23 21:25:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Room from '../views/Room.vue'
import User from '../views/User.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/room/:code',
    name: 'Room',
    component: Room
  },
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  routes
})

export default router
