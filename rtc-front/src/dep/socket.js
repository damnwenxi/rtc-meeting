/*
 * @Author: kefeng
 * @Date: 2020-03-06 22:19:46
 * @LastEditTime: 2020-03-31 23:15:03
 * @LastEditors: Please set LastEditors
 * @Description: socket封装
 * @FilePath: /rtc-meeting/rtc-front/src/dep/socket.js
 */

import io from '../assets/js/socket.io'

let socket = io('http://192.168.1.3:3001')

socket.on('connect', () => {
  console.log('ws server connected.')
})

// 封装一个send方法
socket.send = function (message) {
  message.ts = new Date().getTime()
  socket.emit('message', message)
}

export default socket