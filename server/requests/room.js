/*
 * @Date         : 2020-03-24 00:00:19
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-05-01 12:01:37
 * @FilePath     : /rtc-meeting/server/requests/room.js
 */

const express = require('express')
const query = require('../mysql/index')

const room = express.Router()

room.get('/', (req, res) => {
  res.send('room api works.')
})

/**
 * @description: 创建会议
 * @param {owner,owner_id,need_password,title,password} 
 * @return: 
 */
room.post('/create', (req, res) => {
  const data = req.body
  if (!data.owner || !data.owner_id) {
    res.json({ code: -1, msg: 'Nice try.' })
  }
  // 需要密码但是没有密码
  if (data.need_password && !data.password) {
    res.json({ code: -1, msg: '请输入密码' })
  }
  // 生成参加码
  let code = Math.random().toString().substring(2, 8)
  let needPassword = data.need_password ? 1 : 0
  let password = needPassword ? data.password : 'null'

  // 查一下当前有没有正在进行中的会议参加码跟这个一样
  try {
    query('SELECT * FROM room WHERE code = ? AND status = 1', [code]).then(row => {
      if (!row.length) {
        query(
          'INSERT INTO room (code, owner, owner_id, title, need_password, password) VALUES (?,?,?,?,?,?)',
          [
            code,
            data.owner,
            data.owner_id,
            data.title,
            needPassword,
            password
          ]
        ).then(row => {
          if (row.affectedRows > 0) {
            res.json({
              code: 0,
              data: {
                code: code,
                password: password
              },
              msg: '创建成功'
            })
          }
        })
      }
    })
  } catch (e) {
    res.json({ code: -1, msg: '系统错误' })
    console.log(e)
  }
})

/**
 * @description: 加入会议
 * @param {type} 
 * @return: 
 */
room.post('/join', (req, res) => {
  try {
    const data = req.body
    if (!data.room_id){
      res.json({code: 1001,msg:'请输入参加码'})
    }

    query('SELECT * FROM room WHERE code = ?', [data.room_id]).then(row => {
      // 会议不存在
      if(row.length < 1) {
        res.json({
          code: 1002,
          msg: '会议不存在'
        })
      } else {
        let meeting = row[0]
        console.log(row[0])
        // 会议存在但已结束
        if(meeting.status == 0) {
          res.json({
            code: 1003,
            msg: '当前会议已结束'
          })
        } else if(meeting.need_password && meeting.password !== data.password){
          res.json({
            code: 1004,
            msg: '参会密码错误'
          })
        } else {
          res.json({
            code: 0,
            room_id: meeting.code,
            title: meeting.title,
            need_password: meeting.need_password
          })
        }
      }
    })
  } catch (error) {
    res.json({
      code: -1,
      msg: 'system error'
    })
  }
})

module.exports = room
