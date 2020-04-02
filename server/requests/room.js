/*
 * @Date         : 2020-03-24 00:00:19
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-01 00:37:15
 * @FilePath     : /rtc-meeting/server/requests/room.js
 */

const express = require('express')

const room = express.Router()

room.get('/', (req, res) => {
  res.send('room api works.')
})

/**
 * @description: 创建会议
 * @param {owner,owner_id,is_encrypt,title} 
 * @return: 
 */
room.post('/create', (req, res) => {
  res.send('this is the create room api')
  const data = req.body
  if (!data.owner || !data.owner_id) {
    res.json({ code: -1, msg: 'Nice try.' })
  }

  let password, code

  // 生成密码
  if (data.is_encrypt) {
    password = Math.random().toString().substring(4, 8)
  }
})

/**
 * @description: 加入会议
 * @param {type} 
 * @return: 
 */
room.post('/join', (req, res) => {
  res.send('this is the join room api')
})

module.exports = room
