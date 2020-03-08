<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:25
 * @LastEditTime: 2020-03-08 17:22:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/views/Room.vue
 -->
<template>
  <div class="room">
    <div class="main-user-tip">{{mainUser}}</div>

    <video id="local-video" autoplay playsinline class="video" src></video>
    <video id="remote-video" autoplay playsinline class="video" src></video>

    <div class="btn-wrap">
      <v-btn @click="start()">start</v-btn>
      <v-btn @click="call()">call</v-btn>
      <v-btn @click="join()">join</v-btn>
    </div>

    <div class="footer-bar">
      <div class="user-count">
        <v-icon dark>mdi-account-multiple</v-icon>
        参会人数: {{userCount}}
      </div>
      <div class="room-title">{{roomTitle}}</div>

      <div @click="toggleChat()" :class="{'chat-active': showChat}" class="chat">
        <v-icon dark>mdi-message-text</v-icon>
      </div>
      <div class="hang-up">
        <v-icon dark>mdi-phone-hangup</v-icon>
      </div>
    </div>

    <Message :class="{'show-message': showChat}" />
  </div>
</template>

<script>
import socket from '../dep/socket'
import Message from '../components/Message'

export default {
  components: {
    Message
  },
  data() {
    return {
      mediaStreamConstraints: {
        video: true,
        audio: false
      },
      localStream: null,
      localVideo: null,
      socket: null,
      mainUser: '主视频',
      roomTitle: '会议标题',
      userCount: 4,
      showChat: false,
      // pcList peerConnection 列表
      pcList: [],
      // ICE服务器列表
      pcConfig: {
        iceServers: [
          {
            urls: 'turn:129.211.64.178:3478',
            username: 'kefeng',
            credential: '123456'
          }
        ]
      }
    }
  },
  created() {
    socket.removeAllListeners()
    socket.on('message', message => {
      console.log(message)

      if (message.type === 'answer_res') {
        if (message.content) {
          const remoteDesc = new RTCSessionDescription(message.content)
          let pc = this.pcList[0]
          if (!pc.remoteDescription) {
            pc.setRemoteDescription(remoteDesc)
            console.log(pc)
          }
        }
      } else if (message.type === 'offer_res') {
        if (message.content) {
          let pc = this.pcList[0]
          pc.setRemoteDescription(new RTCSessionDescription(message.content))
          pc.createAnswer().then(answer => {
            pc.setLocalDescription(answer)
            socket.send({
              id: '3211',
              ts: Date.now(),
              type: 'answer',
              content: answer
            })
            console.log(pc)
          })
        }
      } else if (message.type === 'icecandidate_res') {
        console.log(this.pcList[0])
        debugger
        try {
          this.pcList[0].addIceCandidate(message.content)
        } catch (e) {
          console.log(e)
        }
      }
    })
  },
  mounted() {
    this.localVideo = document.getElementById('local-video')
    this.remoteVideo = document.getElementById('remote-video')
  },
  computed: {
    videoTracks() {
      if (this.localStream) {
        return this.localStream.getVideoTracks()
      }
    },
    audioTracks() {
      if (this.localStream) {
        return this.localStream.getAudioTracks()
      }
    }
  },
  methods: {
    start() {
      navigator.mediaDevices
        .getUserMedia(this.mediaStreamConstraints)
        // 获取本地媒体流
        .then(this.gotLocalMediaStream)
        .catch(this.handleLocalMediaStreamError)
    },
    call() {
      this.createPeerConnection()
    },
    join() {
      this.getRemoteOffers()
    },
    // 获取到本地媒体流
    gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream
      this.localVideo.srcObject = this.localStream
    },
    // 获取本地媒体流失败回调
    handleLocalMediaStreamError(err) {
      console.log('get local video stream failed.', err)
    },
    // 聊天
    toggleChat() {
      this.showChat = !this.showChat
    },
    // 创建rtc连接
    createPeerConnection() {
      let peerConnection = new RTCPeerConnection(this.pcConfig)

      // 这里是个巨坑，要在createOffer之前把媒体流挂载到连接上，不然永远不会触发icecandidate
      // 挖个坟给自己
      peerConnection.addStream(this.localStream)

      peerConnection
        .createOffer()
        .then(offer => {
          console.log(offer)
          peerConnection.setLocalDescription(offer).then(() => {
            console.log('set local description success')
          })
          socket.send({
            id: '12345',
            ts: Date.now(),
            type: 'offer',
            content: offer
          })
        })
        .catch(e => {
          console.log('create offer failed.')
        })
      // 给rtc连接添加事件
      peerConnection.onicecandidate = this.icecandidateHandle
      peerConnection.oniceconnectionstatechange = this.icecandidateHandle
      peerConnection.onaddstream = this.remoteStreamAddHandle

      this.pcList.push(peerConnection)
    },
    // 应答方请求ws，获取其他人的offer建立连接
    getRemoteOffers() {
      const peerConnection = new RTCPeerConnection(this.pcConfig)
      peerConnection.addStream(this.localStream)
      // 给rtc连接添加事件
      peerConnection.onicecandidate = this.icecandidateHandle
      peerConnection.oniceconnectionstatechange = this.icecandidateHandle
      peerConnection.onicecandidateerror = this.icecandidateErrorHandle
      peerConnection.onaddstream = this.remoteStreamAddHandle
      this.pcList.push(peerConnection)
      socket.send({
        type: 'offer_req'
      })
    },
    // ice连接成功回调
    icecandidateHandle(event) {
      if (event && event.candidate) {
        socket.send({
          type: 'icecandidate',
          content: event.candidate
        })
      }
    },
    // ice连接错误回调
    icecandidateErrorHandle(event) {
      console.log(event)
    },

    // ice连接失败回调
    handleIceFailed(event) {
      console.log(event)
    },

    remoteStreamAddHandle(event) {
      if (event && event.stream) {
        this.remoteVideo.srcObject = event.stream
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.room {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: #fff;

  .main-user-tip {
    position: absolute;
    top: 20px;
    left: 20px;
    border-left: 5px solid #0f4c81;
    line-height: 40px;
    padding: 0 10px;
    border-radius: 0 5px 5px 0;
    font-size: 16px;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
  }

  .footer-bar {
    position: absolute;
    height: 40px;
    width: 100%;
    bottom: 0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    font-size: 16px;
    color: #fff;

    .user-count {
      text-align: center;
    }

    .room-title {
      font-weight: bold;
      flex-grow: 1;
      text-align: center;
    }

    .chat {
      margin-right: 20px;
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .chat-active {
      background: rgba(255, 255, 255, 0.9);
      i {
        color: #0f4c81;
      }
    }

    .hang-up {
      width: 30px;
      height: 30px;
      background: red;
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  #main-video {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .video {
    top: 100px;
    width: 300px;
    height: 200px;
    background: #000;
  }
}
</style>