/*
 * @Date         : 2020-03-24 23:01:12
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-03 23:52:50
 * @FilePath     : /rtc-meeting/rtc-front/src/service/service.js
 */


import axios from './index'

/**
 * @description 用户注册
 * @param {Object} 
 * @return: Promise
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
 * @param {Object} 
 * @return: Promise
 */
export function login(params) {
  return axios.post('/api/user/login', {
    name: params.name,
    password: params.password
  })
}

/**
 * @description: 重置密码发送
 * @param {Object} 
 * @return: Promise
 */
export function resetPassword(params) {
  return axios.post('/api/user/resetPassword', {
    email: params.email
  })
}


/**
 * @description: 创建会议室
 * @param {Object}
 * @return: Promise
 */
export function createRoom(params) {
  return axios.post('/api/room/create', {
    owner: params.owner,
    owner_id: params.owner_id,
    title: params.title,
    password: params.password,
    need_password: params.need_password
  })
}
