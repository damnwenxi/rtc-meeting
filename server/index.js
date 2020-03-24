/*
 * @Author: your name
 * @Date: 2020-02-27 21:52:57
 * @LastEditTime: 2020-03-25 00:20:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/server/index.js
 */
const express = require('express')
const app = express()
// mysql 查询
const query = require('./mysql/index')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')

const user = require('./requests/user')
const room = require('./requests/room')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user', user)
app.use('/room', room)

app.get('/', (req, res) => {

  query('select * from songs').then(rows => {
    res.json(rows)
  }).catch(err => {
    res.json(err)
    console.log(err)
  })

})

app.post('/createRoom', (req, res) => {

})

let offer = ''

io.on('connection', socket => {

  // join room
  socket.on('join_room', data => {
    socket.join(data.room_id)
    // 加入房间后广播一条消息到房间
    io.to(data.room_id).emit('user_join', {
      user_name: data.user_name,
      room_id: data.room_id
    })
  })

  socket.on('message', data => {

    /**
     * peer_connection建立规则：
     * 创建房间的用户只加入房间，其他什么都不做，其他人加入房间前在本地生成offer，加入房间后将offer广播给房间内
     * 所有用户，用户收到offer后依次建立连接。
     */

    // offer处理
    if (data.type === 'offer') {
      io.to(data.room_id).emit('message', {
        type: 'new_offer_get',
        offer: data.offer,
        user_name: data.user_name,
        room_id: data.room_id
      })
    }

    // answer处理
    if (data.type === 'answer') {
      io.to(data.room_id).emit('message', {
        type: 'new_answer_get',
        answer: data.answer,
        user_name: data.user_name,
        room_id: data.room_id
      })
    }

    // icecandidate处理
    if (data.type === 'icecandidate') {
      io.to(data.room_id).emit('message', {
        type: 'icecandidate_res',
        icecandidate: data.icecandidate,
        user_name: data.user_name,
        room_id: data.room_id
      })
    }
  })

})

http.listen(3001, () => {
  console.log("app is running on port 3000.")
})