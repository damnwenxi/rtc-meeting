<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:25
 * @LastEditTime: 2020-02-27 22:49:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/views/Room.vue
 -->
<template>
  <div class="room">
    <div class="video-wrap">
      <video id="local-video" autoplay playsinline class="video" src></video>
    </div>
    <div class="remote-video">
      <video class="video" src></video>
    </div>

    <div class="btn-wrap">
      <v-btn>start</v-btn>
      <v-btn @click="sendMessage()">call</v-btn>
      <v-btn>hang up</v-btn>
    </div>
  </div>
</template>

<script>
import io from '../assets/js/socket.io'

export default {
  data() {
    return {
      mediaStreamConstraints: {
        video: true,
        audio: false
      },
      localStream: null,
      localVideo: null,
      socket: null
    }
  },
  created() {
    let socket = io('http://127.0.0.1:3001')
    this.socket = socket
    socket.on('connect', () => {
      console.log('socket is openning.')
    })
  },
  mounted() {
    this.localVideo = document.getElementById('local-video')
    navigator.mediaDevices
      .getUserMedia(this.mediaStreamConstraints)
      .then(this.getLocalMediaStream)
      .catch(this.handleLocalMediaStreamError)
  },
  methods: {
    getLocalMediaStream(mediaStream) {
      this.localStream = mediaStream
      this.localVideo.srcObject = this.localStream
    },
    handleLocalMediaStreamError(err) {
      console.log('get local video stream failed.', err)
    },
    sendMessage() {
      console.log('123')
      this.socket.emit('message', { content: 'hello server.' })
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  width: 400px;
  // filter: blur(4px) invert(1) opacity(0.5);
}
</style>