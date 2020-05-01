/*
 * @Author: kefeng
 * @Date: 2020-03-06 22:19:46
 * @LastEditTime : 2020-05-01 11:20:08
 * @LastEditors  : kefeng
 * @Description: socket封装
 * @FilePath     : /rtc-meeting/rtc-front/src/dep/socket.js
 */

import io from '../assets/js/socket.io'

let socket = io('http://192.168.123.26:3000')

socket.on('connect', () => {
  console.log('ws server connected.')
})

// 封装一个send方法
socket.send = function (message) {
  message.ts = new Date().getTime()
  socket.emit('message', message)
}

export default socket