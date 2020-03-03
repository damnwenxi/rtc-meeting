/*
 * @Author: your name
 * @Date: 2020-02-27 21:52:57
 * @LastEditTime: 2020-03-03 19:26:59
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

io.on('connection', socket => {
  console.log('user connected.')

  socket.on('message', data => {
    console.log(data)
  })

  socket.broadcast.emit('open')
})

http.listen(3001, () => {
  console.log("app is running on port 3000.")
})