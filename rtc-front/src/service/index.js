/*
 * @Author: your name
 * @Date: 2020-03-24 23:01:19
 * @LastEditTime: 2020-03-25 00:06:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/service/index.js
 */

import axios from 'axios'

axios.defaults.timeout = 5000

axios.defaults.baseURL = ''

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})

export default axios
