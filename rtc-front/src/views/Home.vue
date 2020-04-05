<!--
 * @Author: your name
 * @Date: 2020-02-22 22:01:05
 * @LastEditTime : 2020-04-05 15:36:02
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/views/Home.vue
 -->
<template>
  <div class="home">
    <div class="banner">
      <div class="cover"></div>
      <div class="content">
        <h1 class="home-title">WebRTC视频会议</h1>
        <div class="btn-wrap">
          <v-btn @click="joinRoom()" class="join" large>加入会议</v-btn>
          <v-btn @click="createRoom()" class="create" large>创建会议</v-btn>
        </div>
      </div>
    </div>

    <div class="count">
      <div class="user-count">
        <p class="label">注册用户</p>
        <span class="number">89063人</span>
      </div>
      <v-divider vertical></v-divider>
      <div class="room-online">
        <p class="label">在线会议室</p>
        <span class="number">5间</span>
      </div>
      <v-divider vertical></v-divider>
      <div class="user-online">
        <p class="label">活跃用户</p>
        <span class="number">453人</span>
      </div>
    </div>

    <JoinRoom ref="joinModal" />

    <CreateRoom ref="createModal" />
  </div>
</template>
 
<script>
import JoinRoom from '../components/JoinRoom'
import CreateRoom from '../components/CreateRoom'

export default {
  data() {
    return {}
  },
  components: {
    JoinRoom,
    CreateRoom
  },
  methods: {
    joinRoom() {
      this.$refs.joinModal.show()
    },
    createRoom() {
      this.$refs.createModal.show()
    }
  }
}
</script>
 
<style lang="scss" scoped>
.home {
  .banner {
    position: relative;
    background-image: url('../assets/img/banner.jpg');
    width: 100%;
    height: 560px;
    background-size: cover;

    .cover,
    .content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .cover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    .content {
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;

      .home-title {
        font-size: 54px;
      }
      .btn-wrap {
        margin-top: 96px;

        button {
          margin: 0 20px;
        }
      }
    }
  }

  .count {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 40px 0;
    text-align: center;

    .label {
      // color: #a5b8d0;
      color: #0f4c81;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
</style>
