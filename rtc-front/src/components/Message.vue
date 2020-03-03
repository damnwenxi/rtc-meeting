<!--
 * @Author: your name
 * @Date: 2020-02-22 22:43:46
 * @LastEditTime: 2020-03-03 21:29:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/components/Message.vue
 -->
<template>
  <div class="message-list">
    <h2 class="title">
      <v-icon dark>mdi-android-messages</v-icon>
      <span class="discuss">讨论</span>
    </h2>
    <ul class="list-wrap">
      <li class="list-item" v-for="message in messageList" :key="message.id">
        <img class="avatar" :src="message.avatar" />
        <div class="time-content">
          <div class="time">{{message.date}}</div>
          <div class="content">{{message.content}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { messageList } from './mock'
export default {
  data() {
    return {
      messageList: messageList
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.message-list {
  position: absolute;
  top: 0;
  bottom: 40px;
  right: -100%;
  width: 300px;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 20px;
  transition: right 0.5s;

  .title {
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
    position: absolute;
    top: 64px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    overflow-y: auto;

    .list-item {
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: space-between;

      .avatar {
        margin-right: 10px;
        height: 30px;
        width: 30px;
      }

      .time-content {
        flex-grow: 1;
        text-align: left;
        color: #fff;
        font-size: 14px;

        .time {
          font-size: 10px;
          color: #ccc;
        }
      }
    }
  }
}

.show-message {
  right: 0;
}
</style>