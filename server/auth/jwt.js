/*
 * @Date         : 2020-04-05 13:12:53
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-14 22:45:40
 * @FilePath     : /rtc-meeting/server/auth/jwt.js
 */

const { secretKey } = require('./constant')

const expresJwt = require('express-jwt')

const jwtAuth = expresJwt({ secret: secretKey }).unless({
  path: [
    '/user/login',
    '/user/register',
    '/room/join'
  ]
})

module.exports = {
  jwtAuth
}