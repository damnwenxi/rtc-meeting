/*
 * @Date         : 2020-04-05 13:12:53
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-05-09 22:38:21
 * @FilePath     : /rtc-meeting/server/auth/jwt.js
 */

const { secretKey } = require('./constant')

const expresJwt = require('express-jwt')

const jwtAuth = expresJwt({ secret: secretKey }).unless({
  path: [
    '/null',
    '/',
    '/api/user/login',
    '/api/user/register',
    '/api/room/join',
    /.*\..*/g
  ]
  // path: [
  //   '/user/login',
  //   '/user/register',
  //   '/room/join',
  //   // /.*\..*/g
  // ]
})

module.exports = {
  jwtAuth
}