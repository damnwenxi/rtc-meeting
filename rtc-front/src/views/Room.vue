<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:25
 * @LastEditTime: 2020-03-06 23:04:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/views/Room.vue
 -->
<template>
  <div class="room">
    <div class="main-user-tip">{{mainUser}}</div>

    <button class="test-btn" @click="getRemoteOffers()">get offer</button>
    <video id="main-video" autoplay playsinline class="video" src></video>
    <!-- <div class="btn-wrap">
      <v-btn>start</v-btn>
      <v-btn @click="sendMessage()">call</v-btn>
      <v-btn>hang up</v-btn>
    </div>-->

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
      // ICE服务器列表
      turnServers: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    }
  },
  created() {},
  mounted() {
    this.localVideo = document.getElementById('main-video')
    navigator.mediaDevices
      .getUserMedia(this.mediaStreamConstraints)
      // 获取本地媒体流
      .then(this.gotLocalMediaStream)
      .catch(this.handleLocalMediaStreamError)
  },
  computed: {
    videoTracks() {
      if (this.localStream) {
        return this.localStream.getVideoTracks()
      }
    },
    audioTracks() {
      if (this.localStream) {
        return this.localVideo.getAudioTracks()
      }
    }
  },
  methods: {
    // 获取到本地媒体流
    gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream
      this.localVideo.srcObject = this.localStream
      this.createPeerConnection()
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
    async createPeerConnection() {
      let peerConnection = new RTCPeerConnection(this.turnServers)
      trace('create peerConnection')
      console.log(peerConnection)

      const offer = await peerConnection.createOffer()
      // create offer 后通过socket.io发送给ws服务器
      socket.send('offer', {
        id: '12345',
        ts: Date.now(),
        content: offer
      })

      // 给rtc连接添加事件
      peerConnection.addEventListener('icecandidate', event => {
        console.log(event)
      })
      peerConnection.addEventListener(
        'iceconnectionstatechange',
        this.handleConnectionChange()
      )
      console.log(peerConnection)
      return peerConnection
    },
    // 请求ws，获取其他人的offer
    getRemoteOffers() {
      socket.send('offer_req', {
        id: '12345',
        ts: Date.now()
      })

      socket.removeAllListeners(['offer_res'])
      socket.on('offer_res', data => {
        console.log('收到的offer是:')
        console.log(data)
      })
    },
    // 连接建立成功回调
    handleConnection(event) {
      console.log(event)
      // const peerConnection = event.target
      // const iceCandidate = event.candidate
    },
    // 连接改变回调
    handleConnectionChange(event) {
      console.log(event)
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
}
</style>