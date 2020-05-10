/*
 * @Author: your name
 * @Date: 2020-02-27 21:52:57
 * @LastEditTime : 2020-05-09 22:35:24
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/server/index.js
 */
const express = require('express')
const app = express()
const fs = require('fs')
const pk = fs.readFileSync('./cert/2_itsadomain.xyz.key')
const pc = fs.readFileSync('./cert/1_itsadomain.xyz_bundle.crt')
const https = require('https').createServer({
  key: pk,
  cert: pc
},app)
// const https = require('http').createServer(app)

const io = require('socket.io')(https)
const bodyParser = require('body-parser')

const user = require('./requests/user')
const room = require('./requests/room')
const { jwtAuth } = require('./auth/jwt')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(jwtAuth)

app.use('/', express.static('dist'))

app.use('/api/user', user)
app.use('/api/room', room)
// app.use('/user', user)
// app.use('/room', room)

app.get('/', (req, res) => {
  res.send('./dist/index.html')
})

io.on('connection', socket => {

  socket.on('message', data => {

    /**
     * peer_connection建立规则：
     * 创建房间的用户只加入房间，其他什么都不做，其他人加入房间前在本地生成offer，加入房间后将offer广播给房间内
     * 所有用户，用户收到offer后依次建立连接。
     */

    // 用户加入
    if (data.type === 'join_room') {
      socket.join(data.room_id)
      console.log(data.user_name + '加入了房间：' + data.room_id)
      // 加入房间后广播一条消息到房间
      io.to(data.room_id).emit('message', {
        type: 'user_join',
        user_name: data.user_name,
        room_id: data.room_id,
        user_role: data.user_role,
        user_number: data.user_number
      })
    }

    // 用户离开
    if (data.type === 'leave_room') {
      console.log(data.user_name + '离开了房间：' + data.room_id)
      io.to(data.room_id).emit('message', {
        type: 'user_leave',
        user_name: data.user_name,
        room_id: data.room_id,
        user_role: data.user_role,
        user_number: data.user_number
      })
      socket.leave(data.room_id)
    }

    // 聊天
    if (data.type === 'chat') {
      console.log(data)
      io.to(data.room_id).emit('message', {
        type: 'chat_res',
        from: data.from,
        content: data.content,
        time: data.time,
        number: data.number
      })
    }

    // offer处理
    if (data.type === 'offer') {
      io.to(data.room_id).emit('message', {
        type: 'new_offer_get',
        offer: data.offer,
        to: data.to,
        from: data.from,
        room_id: data.room_id,
        user_role: data.user_role,
        user_number: data.user_number
      })
    }

    // answer处理
    if (data.type === 'answer') {
      io.to(data.room_id).emit('message', {
        type: 'new_answer_get',
        answer: data.answer,
        from: data.from,
        to: data.to,
        room_id: data.room_id,
        user_role: data.user_role,
        user_number: data.user_number
      })
    }

    // 房间内成员更新
    if (data.type === 'user_update') {
      io.to(data.room_id).emit('message', {
        type: 'user_update_res',
        user_list: data.user_list,
        room_id: data.room_id,
        user_role: data.user_role,
        user_name: data.user_name,
        user_number: data.user_number
      })
    }

    // icecandidate处理
    if (data.type === 'icecandidate') {
      io.to(data.room_id).emit('message', {
        type: 'icecandidate_res',
        icecandidate: data.icecandidate,
        from: data.from,
        to: data.to,
        room_id: data.room_id,
        user_role: data.user_role,
        user_number: data.user_number
      })
    }

    // 发送文件
    if (data.type === 'send_file') {
      console.log(data)
      io.to(data.room_id).emit('message', {
        type: 'send_file_res',
        from: data.from,
        room_id: data.room_id,
        number: data.user_number,
        id: data.id,
        time: data.time,
        file_size: data.file_size,
        file_name: data.file_name
      })
    }
  })

})

https.listen(3000, () => {
  console.log("app is running on port 3000.")
})