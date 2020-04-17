<!--
 * @Author: your name
 * @Date: 2020-02-22 22:21:25
 * @LastEditTime : 2020-04-17 16:37:47
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/views/Room.vue
 -->
<template>
  <div class="room">
    <div class="room-info-tip">
      <span class="room-code" v-if="code">参加码： {{code}}</span>
      <span class="room-password" v-if="password">密码： {{password}}</span>
    </div>

    <div id="video-list">
      <div class="video-wrap" :class="{'full-screen': fullScreen}">
        <div class="video-info">
          <span class="video-name">{{this.name}}</span>
        </div>
        <video id="local-video" autoplay playsinline class="video" :class="{'screen': isScreenShare}" src></video>
      </div>
      <div v-for="item in remoteUserList"
          :key="item.number" class="video-wrap">
        <div class="video-info">
          <span class="video-name">{{item.name}}</span>
        </div>
        <video
          :id="item.number"
          autoplay
          playsinline
          class="video"
          :class="{'screen': isScreenShare}"
          src
        ></video>
      </div>
    </div>

    <div class="footer-bar">
      <div class="user-count">
        <v-icon dark>mdi-account-multiple</v-icon>
        参会人数: {{userCount}}
      </div>
      <div class="room-title">{{title || ''}}</div>

      <div @click="screenShare()" :class="{'icon-active': isScreenSharing}" class="screen">
        <v-icon dark>mdi-monitor-screenshot</v-icon>
      </div>

      <div @click="toggleFile()" :class="{'icon-active': showFile}" class="file">
        <v-icon dark>mdi-folder</v-icon>
      </div>

      <div @click="toggleChat()" :class="{'icon-active': showChat}" class="chat">
        <v-icon dark>mdi-message-text</v-icon>
      </div>
      <div @click="hangup()" class="hang-up">
        <v-icon dark>mdi-phone-hangup</v-icon>
      </div>
    </div>

    <!-- room tip -->
    <v-snackbar
      v-model="showUserTip"
      right
      top
      :color="'info'"
      :timeout="timeout"
    >
    <span>{{userTip.name}}</span>{{userTip.action}}了房间
    </v-snackbar>

    <!-- close modal -->
    <v-dialog
      v-model="showDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">提示</v-card-title>

        <v-card-text>
          确定要退出会议吗？
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="showDialog = false"
          >
            取消
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="quit()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 聊天组件 -->
    <Message :class="{'show-message': showChat}" />

    <!-- 文件管理组件 -->
    <FileManager :pcList="pcList" v-show="showFile" @close="showFile = false" />
  </div>
</template>

<script>
import socket from '../dep/socket'
import Message from '../components/Message'
import FileManager from '../components/FileManager'
import {mapGetters, mapMutations} from 'vuex'

export default {
  components: {
    Message,
    FileManager
  },
  data() {
    return {
      // 用户加入离开提示
      timeout: 2000,
      showUserTip: false,
      userTip: {
        name: '',
        action: ''
      },
      showDialog: false,
      mediaStreamConstraints: {
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        },
        audio: false
      },

      localStream: null,
      localScreenStream: null,
      localVideo: null,
      remoteVideo: null,
      socket: null,
      mainUser: '主视频',
      showChat: false,
      showFile: false,
      isScreenShare: false,
      // pcList peerConnection 列表
      pcList: [],
      // ICE服务器列表
      pcConfig: {
        iceServers: [
          {
            urls: 'turn:129.211.64.178:3478',
            username: 'kefeng',
            credential: '123456'
          },
          {
            urls: 'stun:stun.l.google.com:19302'
          },
          {
            urls: 'stun:stun1.l.google.com:19302'
          },
          {
            urls: 'stun:stun2.l.google.com:19302'
          }
        ]
      },
      // 房间id / 参加码
      code: '',
      password: '',
      name: '',
      role: '',
      title: '',
      number: Math.random()
        .toString()
        .substring(2, 8),
      // 当前房间内用户，这个数组由会议发起者负责更新
      userList: [],
      fullScreen: true
    }
  },
  created() {
    // 监听一下unload事件
    window.onbeforeunload = (e) => {
      const flag = window.event || e
      flag.returnValue = ('确定要离开此页面吗？')
    }
    // 从路由拿房间信息
    this.code = this.$route.query.code
    this.password = this.$route.query.password
    this.name = this.$route.query.name
    this.role = this.$route.query.role
    this.title = this.$route.query.title

    this.updateUser({
      code: this.code,
      name: this.name,
      role: this.role,
      number: this.number
    })

    if (!this.code) {
      this.$emit('tip', {
        code: -1,
        msg: '会议室不存在'
      })
      return
    }
    if (this.$route.query.type === 'screen') {
      this.screenShare()
      this.isScreenShare = true
    } else{
      this.start()
    }
    
    // 在这里处理所有的建立连接相关的websocket信息
    // 这里要先清除所有的监听事件，否则会引发重复监听
    // 客户端只监听message这一个事件，根据message的type不同作出不同反应
    socket.removeAllListeners()
    socket.on('message', data => {
      // 用户加入
      if (data.type === 'user_join') {
        console.log(data.user_name + '加入了房间' + data.room_id)
        this.showUserTip = true
        this.userTip.name = data.user_name
        this.userTip.action = '加入'
        // 会议发起者要更新当前房间内成员信息，并将这个列表给wss
        if (this.role === 0) {
          this.userList.push({
            name: data.user_name,
            role: data.user_role,
            number: data.user_number,
            joints: data.ts
          })
          socket.send({
            type: 'user_update',
            user_list: this.userList,
            user_name: this.name,
            user_role: this.role,
            room_id: this.code,
            user_number: this.number
          })
        }
      }

      // 用户离开
      if (data.type === 'user_leave' && data.user_number !== this.number) {
        // 销毁播放器
        const self = document.getElementById(data.user_number)
        const parent = self.parentElement
        const removed = parent.removeChild(self)
        // 关闭与离开用户的rtc连接
        this.closePeerConnection(data.user_number)
        // 更新当前用户列表
        this.userList = this.userList.filter(item => {
          return item.number !== data.user_number
        })
        this.showUserTip = true
        this.userTip.name = data.user_name
        this.userTip.action = '离开'
      }

      // 这里监听到的offer是新加入用户发来的
      if (data.type === 'new_offer_get') {
        if (data.offer) {
          // 自己发的不做处理
          if (data.from === this.name) {
            return
          }
          console.log(data.from + '的offer:')
          try {
            // 为新加入的远端用户新建一个peerConnection，拿到offer 要给远端发answer
            if (data.to === this.name) {
              this.createPeerConnectionForRemote(data)
            }
          } catch (error) {
            console.log('建立连接失败')
          }
        }
      }
      if (data.type === 'new_answer_get') {
        if (data.answer) {
          // 同样，自己发的直接返回
          if (data.from === this.name) {
            return
          }
          console.log(data.from + 'answer:' + data.answer)
          if (data.to === this.name) {
            this.findAndSetAnswerForRemote(data)
          }
        }
      }
      if (data.type === 'icecandidate_res') {
        try {
          if (data.to === this.name) {
            this.findAndSetIceCandidate(data)
          }
        } catch (e) {
          console.log(e)
        }
      }
      // 房间成员更新
      if (data.type === 'user_update_res') {
        // 会议发起者不需要更新了
        if (this.role === 0) {
          return
        }
        this.userList = data.user_list
      }
    })
  },
  mounted() {
    this.localVideo = document.getElementById('local-video')
  },
  watch: {
    userList: {
      deep: true,
      handler: function(newList, oldList) {
        // 当前只有自己时全屏视频
        if (newList.length > 1) {
          this.fullScreen = false
        } else {
          this.fullScreen = true
        }
        let newNameList = newList.map(item => item.name)
        let oldNameList = oldList.map(item => item.name)
        // 只有参会者响应这个变化
        if (this.role === 1) {
          let deltaList = newList.filter(item => {
            return (
              item.name !== this.name && oldNameList.indexOf(item.name) === -1
            )
          })
          console.log('新增用户:'+ deltaList)

          // 如果新增的用户数量大于1，那说明是刚加入的自己，此时只需要给会议发起者创建连接
          if (deltaList.length > 1) {
            deltaList.forEach((item, index) => {
              if (item.role === 0) {
                this.createPeerConnectionForSelf(item)
              }
            })
            return
          }
          // 拿到新增用户,为新增用户创建连接
          // 这里注意闭包
          deltaList.forEach((item, index) => {
            console.log(item)
            setTimeout(() => {
              this.createPeerConnectionForSelf(item)
            }, 1000*(index+1))
          })
        }
      }
    }
  },
  computed: {
    ...mapGetters['loginUser', 'user'],
    videoTracks() {
      if (this.localStream) {
        return this.localStream.getVideoTracks()
      }
    },
    audioTracks() {
      if (this.localStream) {
        return this.localStream.getAudioTracks()
      }
    },
    remoteUserList() {
      return this.userList.filter(user => {
        return user.number !== this.number
      })
    },
    userCount () {
      return this.userList.length || 1
    }
  },
  methods: {
    ...mapMutations(['updateLoginUser', 'updateUser']),
    screenShare() {
      const option = {
        video: true
      }
      navigator.mediaDevices
        .getDisplayMedia(option)
        .then(this.gotLocalMediaStream)
        .catch(this.handleLocalMediaStreamError)
    },
    toggleFile() {
      this.showFile = !this.showFile
    },
    start() {
      navigator.mediaDevices
        .getUserMedia(this.mediaStreamConstraints)
        // 获取本地媒体流
        .then(this.gotLocalMediaStream)
        .catch(this.handleLocalMediaStreamError)
    },
    quit () {
      this.close()
      this.$router.push({
        name: 'Home'
      })
    },
    hangup () {
      this.showDialog = true
    },
    close() {
      this.leaveRoom()
      // 关闭当前与自己的所有连接
      this.pcList.forEach(item => {
        console.log('关闭：' + item.user)
        item.pc && item.pc.close()
        item.pc = null
      })
      this.pcList = []
      this.userList = []
      // 关闭摄像头与麦克风
      this.videoTracks.forEach(item => {
        item.stop()
      })
      this.audioTracks.forEach(item => {
        item.stop()
      })
    },
    // 离开房间
    leaveRoom () {
      socket.send({
        type: 'leave_room',
        user_name: this.name,
        user_number: this.number,
        user_role: this.role,
        room_id: this.code
      })
    },
    // 关闭与某用户的连接
    closePeerConnection (user_number) {
      console.log(user_number)
      this.pcList.forEach(item => {
        if (item.number === user_number) {
          item.pc.close()
          item.pc = null
        }
      })
    },
    // 获取到本地媒体流
    gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream
      this.localVideo.srcObject = this.localStream
      // 此时再加入房间
      this.joinRoom()
    },
    // 获取到本地屏幕分享源
    gotScreenStream(mediaStream) {
      this.localScreenStream = mediaStream
      this.joinRoom({
        isScreenShare: true
      })
    },
    joinRoom(option) {
      let isScreenShare = option && option.isScreenShare
      // 第一步加入教室
      socket.send({
        type: 'join_room',
        user_name: isScreenShare ? this.name + '的屏幕分享' : this.name,
        room_id: this.code,
        user_role: isScreenShare ? 1 : this.role,
        user_number: isScreenShare ? this.number + '_share' : this.number
      })
    },
    // 获取本地媒体流失败回调
    handleLocalMediaStreamError(err) {
      console.log('get local video stream failed.', err)
    },
    // 聊天
    toggleChat() {
      this.showChat = !this.showChat
    },

    /**
     * @description 为新加入的远端用户新建一个pc
     * 这里会拿到远端的offer
     * @params: Object
     */
    createPeerConnectionForRemote(data) {
      let peerConnection = new RTCPeerConnection(this.pcConfig)
      let sendChannel = peerConnection.createDataChannel('file_channel_for_'+data.from)
      sendChannel.binaryType = 'arraybuffer'
      sendChannel.addEventListener('open', () => {
        const readyState = sendChannel.readyState
        console.log(`Send channel for ${data.from} state is: ${readyState}`)
      })
      this.pcList.push({
        user: data.from,
        number: data.user_number,
        pc: peerConnection,
        sendChannel
      })

      // 判断是不是屏幕分享
      let isScreenShare = data.user_number.includes('share')

      // 这里是个巨坑，要在createOffer/Answer之前把媒体流挂载到连接上，不然永远不会触发icecandidate
      // 挖个坟
      peerConnection.addStream(isScreenShare ? this.localScreenStream : this.localStream)
      // 给peerConnection绑定事件
      peerConnection.onicecandidate = event => {
        console.log('ice 成功获取:')
        if (event && event.candidate) {
          socket.send({
            type: 'icecandidate',
            icecandidate: event.candidate,
            from: this.name,
            to: data.user_name,
            room_id: this.code,
            user_role: this.role,
            user_number: this.number
          })
        }
      }
      // peerConnection.oniceconnectionstatechange = event => {
      //   console.log('ice 改变了:')
      //   if (event && event.candidate) {
      //     socket.send({
      //       type: 'icecandidate',
      //       icecandidate: event.candidate,
      //       from: this.name,
      //       to: data.user_name,
      //       room_id: this.code,
      //       user_role: this.role,
      //       user_number: this.number
      //     })
      //   }
      // }
      peerConnection.onaddstream = event => {
        if (event && event.stream) {
          document.getElementById(data.user_number).srcObject = event.stream
        }
      }

      // 把拿到的offer设置到连接
      peerConnection
        .setRemoteDescription(new RTCSessionDescription(data.offer))
        .then(() => {
          peerConnection.createAnswer().then(answer => {
            try {
              peerConnection.setLocalDescription(answer).then(() => {
                socket.send({
                  type: 'answer',
                  room_id: this.code,
                  from: this.name,
                  user_number: this.number,
                  to: data.from,
                  user_role: this.role,
                  answer: answer
                })
              })
            } catch (error) {
              console.log('setLocalDescription failed')
            }
          })
        })
    },

    // 为新加入的用户创建pc
    /**
     * 没有参数
     */
    createPeerConnectionForSelf(user) {
      let peerConnection = new RTCPeerConnection(this.pcConfig)
      let sendChannel = peerConnection.createDataChannel('file_channel_for_'+user.name)
      sendChannel.binaryType = 'arraybuffer'
      sendChannel.addEventListener('open', () => {
        const readyState = sendChannel.readyState
        console.log(`Send channel for state is: ${readyState}`)
      })
      this.pcList.push({
        user: user.name,
        pc: peerConnection,
        number: user.number,
        sendChannel
      })
      peerConnection.addStream(this.localStream)

      peerConnection.onicecandidate = event => {
        console.log('ice 成功获取:')
        if (event && event.candidate) {
          socket.send({
            type: 'icecandidate',
            icecandidate: event.candidate,
            from: this.name,
            to: user.name,
            room_id: this.code,
            user_role: this.role,
            user_number: this.number
          })
        }
      }
      peerConnection.onaddstream = event => {
        if (event && event.stream) {
          document.getElementById(user.number).srcObject = event.stream
        }
      }

      peerConnection
        .createOffer()
        .then(offer => {
          peerConnection.setLocalDescription(offer).then(() => {
            console.log('set local description success')
            // 将自己的offer发送给远端
            socket.send({
              type: 'offer',
              room_id: this.code,
              user_role: this.role,
              offer: offer,
              to: user.name,
              from: this.name,
              user_number: this.number
            })
          })
        })
        .catch(e => {
          console.log('create offer failed.')
        })
    },
    findAndSetAnswerForRemote(data) {
      let name = data.from
      let targetPc = this.pcList.filter(item => {
        return item.user === name
      })[0]

      targetPc.pc
        .setRemoteDescription(new RTCSessionDescription(data.answer))
        .then(() => {
          // 此时双方连接建立完毕
          console.log('连接建立成功')
        })
    },
    findAndSetIceCandidate(data) {
      let target = this.pcList.filter(item => {
        return data.from === item.user
      })
      var candidate = new RTCIceCandidate(data.icecandidate)
      target[0].pc.addIceCandidate(candidate)
    },
    // ice连接成功回调
    icecandidateHandle(event) {
      console.log('ice 成功获取:')
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
      console.log('remote stream add')
      if (event && event.stream) {
        this.remoteVideo.srcObject = event.stream
      }
    }
  },
  beforDestory() {
    this.close()
  },
  // 路由守卫
  beforeRouteLeave(to, from, next) {
    this.close()
    next()
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
  background: #333;

  .room-info-tip {
    position: absolute;
    top: 0;
    height: 40px;
    line-height: 40px;
    width: 100%;
    padding: 0 20px;
    font-size: 16px;
    color: #fff;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);

    .room-password {
      margin-left: 30px;
    }

    .room-code {
      font-weight: 600;
    }
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

    .chat, .file, .screen {
      margin-right: 20px;
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .icon-active {
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

  #video-list {
    top: 40px;
    bottom: 40px;
    width: 100%;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;

    .video-wrap {
      width: 48%;
      height: 50%;
      margin: 0 1%;
      background: #000;
      position: relative;

      .video-info {
        left: 0;
        right: 0;
        position: absolute;
        top: 0;
        height: 30px;
        background: rgba(0,0,0,.7);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
      }

      .video {
        width: 100%;
        height: 100%;
        transform: rotateY(180deg);
      }

      .screen{
        transform: none;
      }
    }

    .full-screen {
      width: 100%;
      height: 100%;
      position: absolute;
      margin: 0;
    }
  }
}
</style>