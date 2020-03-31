/*
 * @Date         : 2020-03-24 00:00:19
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-01 00:06:49
 * @FilePath     : /rtc-meeting/server/requests/room.js
 */
/*
 * @Author: your name
 * @Date: 2020-03-23 21:37:27
 * @LastEditTime: 2020-03-23 21:49:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/server/requests/room.js
 */

const express = require('express')

const room = express.Router()

room.get('/', (req, res) => {
  res.send('room api works.')
})


room.post('/create', (req, res) => {
  res.send('this is the create room api')
})

room.post('/join', (req, res) => {
  res.send('this is the join room api')
})

module.exports = room
