/*
 * @Date         : 2020-03-24 23:01:12
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-03-31 23:43:00
 * @FilePath     : /rtc-meeting/rtc-front/src/service/service.js
 */


import axios from './index'

/**
 * @description 用户注册
 * @author kefeng
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


/**
 * @description:
 * @param {type}
 * @return:
 */
