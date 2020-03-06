/*
 * @Author: your name
 * @Date: 2020-02-27 21:52:57
 * @LastEditTime: 2020-03-06 22:44:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/server/index.js
 */
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.send('hello world')
})

let offer = ''

io.on('connection', socket => {
  console.log('user connected.')

  socket.on('message', data => {
    console.log(data)
  })

  socket.on('offer', data => {
    console.log('收到客户端发来的offer:')
    console.log(data)
    offer = data.content
  })

  // 收到客户端发来的获取offer请求后,将保存的offer发给客户端
  socket.on('offer_req', data => {
    console.log(data)
    socket.emit('offer_res', offer)
  })

  socket.broadcast.emit('open')
})

http.listen(3001, () => {
  console.log("app is running on port 3000.")
})