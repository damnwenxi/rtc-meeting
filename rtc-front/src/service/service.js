/*
 * @Author: your name
 * @Date: 2020-03-24 23:01:12
 * @LastEditTime: 2020-03-25 23:07:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/service/service.js
 */

import axios from './index'

/**
 * @description 用户注册
 */
export function register(params) {
  return axios.post('/api/user/register', {
    name: params.name,
    email: params.email,
    password: params.password
  })
}

/**
 * @description 用户登录
 */
export function login(params) {
  return axios.post('/api/user/login', {
    name: params.name,
    password: params.password
  })
}

/**
 * @description 重置密码发送
 */
export function resetPassword(params) {
  return axios.post('/api/user/resetPassword', {
    email: params.email
  })
}