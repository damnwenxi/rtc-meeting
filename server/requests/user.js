/*
 * @Author: your name
 * @Date: 2020-03-23 21:37:21
 * @LastEditTime: 2020-03-23 21:46:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/server/requests/user.js
 */

const express = require('express')

const user = express.Router()

user.get('/', (req, res) => {
  res.send('this is the user api')
})

user.post('/login', (req, res) => {
  res.send('this is the user login api')
})

user.post('/register', (req, res) => {
  res.send('this is the user register api')
})

module.exports = user