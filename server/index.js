/*
 * @Author: your name
 * @Date: 2020-02-27 21:52:57
 * @LastEditTime: 2020-03-08 17:06:04
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
  socket.on('message', message => {
    if (message.type === 'offer') {
      offer = message.content
    }

    if (message.type === 'answer') {
      socket.broadcast.emit('message', {
        type: 'answer_res',
        content: message.content
      })
    }

    if (message.type === 'offer_req') {
      socket.emit('message', {
        type: 'offer_res',
        content: offer
      })
    }

    if (message.type === 'icecandidate') {
      socket.broadcast.emit('message', {
        type: 'icecandidate_res',
        content: message.content
      })
    }
  })

})

http.listen(3001, () => {
  console.log("app is running on port 3000.")
})