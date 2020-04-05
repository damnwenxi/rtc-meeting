/*
 * @Author: your name
 * @Date: 2020-03-24 23:01:19
 * @LastEditTime : 2020-04-05 14:48:52
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/service/index.js
 */

import axios from 'axios'

axios.defaults.timeout = 5000

axios.defaults.baseURL = ''

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前:取token，放到header里面
  const jwtToken = window.localStorage.getItem('jwt_token')
  if (jwtToken) {
    config.headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.token) {
    // 返回token的话要更新token
    window.localStorage.setItem('jwt_token', response.data.token)
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 身份验证失败
  if (response.status == 401) {
    window.localStorage.removeItem('jwt_token')
    console.log(this)
  }
  return Promise.reject(error);
})

export default axios
