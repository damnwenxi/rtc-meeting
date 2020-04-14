<!--
 * @Author: your name
 * @Date: 2020-02-22 22:43:46
 * @LastEditTime : 2020-04-13 23:45:02
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/components/Message.vue
 -->
<template>
  <div class="message-list">
    <h2 class="title">
      <v-icon dark>mdi-android-messages</v-icon>
      <span class="discuss">讨论</span>
    </h2>
    <ul class="list-wrap">
      <li class="list-item" v-for="(message, index) in messageList" :key="index">
        <v-avatar size="30" color="#0f4c81">
          <span class="name-avatar white--text">{{message.from.slice(-2)}}</span>
        </v-avatar>
        <div class="time-content">
          <div class="time"> <span class="user-name">{{message.from}}</span> {{message.time}}</div>
          <div class="content">{{message.content}}</div>
        </div>
      </li>
    </ul>

    <div class="message-sender">
      <div class="btn-wrap">
        <span class="content-count">{{currentLength}}/{{maxLength}}</span>
        <span class="send-btn" @click="chatSend">发送</span>
      </div>
      <textarea @keyup.enter="chatSend" v-model="content" class="chat-input" name="chat" id="chat" rows="3"></textarea>
    </div>
  </div>
</template>

<script>
import socket from '../dep/socket'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      messageList: [],
      currentLength: 0,
      maxLength: 140,
      content: ''
    }
  },
  created(){
    socket.on('message', data => {
      if (data.type === 'chat_res') {
        this.messageList.push(data)
        // 自己发送成功清空聊天框
        if (data.number === this.user.number) {
          this.content = ''
        }
        this.$nextTick(() => {
          this.scrollToBottom('.list-wrap')
        })
      }
    })
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    content(val) {
      this.currentLength = val.length
      if (val.length > this.maxLength) {
        this.content = val.slice(0,this.maxLength)
      }
    }
  },
  methods: {
    chatSend() {
      if (!this.content.trim()) {
        return
      }
      socket.send({
        type: 'chat',
        from: this.user.name,
        time: this.getTime(),
        content: this.content,
        room_id: this.user.code,
        number: this.user.number
      })
    },
    scrollToBottom(domSelector, duration) {
      let dom = document.querySelector(domSelector)
      let scrollHeight = dom.scrollHeight
      let clientHeight = dom.clientHeight
      let detal = scrollHeight - clientHeight
      if (detal < 0) {
        return
      }
      dom.scrollTop = detal
    },
    getTime() {
      const now = new Date()
      let hours = now.getHours()
      let minutes = now.getMinutes()
      let seconds = now.getSeconds()
      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      return hours + ':' + minutes + ':' + seconds
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  position: absolute;
  top: 0;
  bottom: 40px;
  right: -100%;
  width: 300px;
  background: rgba(0, 0, 0, 0.8);
  padding: 0 12px;
  transition: right 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  z-index: 10;

  .title {
    width: 100%;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #ccc;
    color: #fff;
    display: flex;

    .discuss {
      margin-left: 10px;
    }
  }

  .list-wrap {
    flex-grow: 1;
    width: 100%;
    left: 0;
    right: 0;
    padding: 10px 0;
    overflow-y: auto;

    .list-item {
      width: 100%;
      padding: 5px 0;
      display: flex;
      justify-content: space-between;

      .v-avatar {
        margin-right: 10px;
        font-size: 12px;

        .name-avatar {
          font-size: 12px;
        }
      }

      .time-content {
        flex-grow: 1;
        text-align: left;
        color: #fff;
        font-size: 14px;

        .user-name {
          color: #fff;
          font-weight: 600;
          margin-right: 16px;
        }

        .time {
          font-size: 10px;
          color: #ccc;
        }

        .content {
          background: #333;
          padding: 7px;
          margin: 5px 0;
          border-radius: 5px;
          font-size: 12px;
          display: inline-block;
        }
      }
    }
  }

  .message-sender {
    width: 100%;

    .btn-wrap {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin-bottom: 10px;
      color: #fff;

      .send-btn {
        padding: 2px 8px;
        background: #0f4c81;
        border-radius: 3px;
        cursor: pointer;
      }
    }

    .chat-input {
      padding: 8px;
      color: #fff;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      resize: none;
      font-size: 14px;
    }
  }
}

.show-message {
  right: 0;
}
</style>