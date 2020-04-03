/*
 * @Author: your name
 * @Date: 2020-03-23 23:28:53
 * @LastEditTime : 2020-04-03 23:35:26
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/server/mysql/index.js
 */
const mysql = require('mysql')

const mysqlConfig = require('./config')

const pool = mysql.createPool(mysqlConfig)

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error)
      } else {
        connection.query(sql, values, (error, rows) => {
          if (error) {
            reject(error)
          } else {
            resolve(rows)
          }
          // 查询结束释放连接
          connection.release()
        })
      }
    })
  })
}

module.exports = query

