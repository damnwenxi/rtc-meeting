<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:25
 * @LastEditTime: 2020-02-24 22:09:55
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      mediaStreamConstraints: {
        video: true,
        audio: false
      },
      localStream: null,
      localVideo: null
    }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  width: 400px;
  filter: blur(4px) invert(1) opacity(0.5);
}
</style>