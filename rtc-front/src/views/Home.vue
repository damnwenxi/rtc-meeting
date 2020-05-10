<!--
 * @Author: your name
 * @Date: 2020-02-22 22:01:05
 * @LastEditTime : 2020-05-10 09:44:12
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

    <div class="introduce">
      <h2 class="introduce-title">基于WebRTC的实时音视频会议系统</h2>
      <p class="introduce-desc">利用信令服务器在浏览器之间建立点对点的连接实现高效数据交换</p>

      <div class="item-list">
        <div class="can-item">
          <img style="padding: 16px" src="../assets/img/live.png" alt="">
          <p class="text">实时音视频</p>
        </div>

        <div class="can-item">
          <img style="padding: 24px" src="../assets/img/screen.png" alt="">
          <p class="text">屏幕分享</p>
        </div>

        <div class="can-item">
          <img src="../assets/img/chat.png" alt="">
          <p class="text">实时文本信息</p>
        </div>

        <div class="can-item">
          <img style="padding: 8px" src="../assets/img/file.png" alt="">
          <p class="text">文件互传</p>
        </div>
      </div>

      <a href="#top" class="back-top">
        现在演示
      </a>
    </div>

    <div class="footer">
      <v-divider></v-divider>
      <p class="copyright">
        Copyright © 2020 kefeng1026@gmail.com
      </p>
    </div>

    <JoinRoom @tip="appTip($event)" ref="joinModal" />

    <CreateRoom @tip="appTip($event)" ref="createModal" />
  </div>
</template>
 
<script>
import JoinRoom from '../components/JoinRoom'
import CreateRoom from '../components/CreateRoom'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['loginUser'])
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
      if (!this.loginUser) {
        console.log(this.loginUser)
        this.$router.push({
          name: 'Login'
        })
        return
      }
      this.$refs.createModal.show()
    },
    // 这里把自组件向上传递来的tip传递到根组件
    appTip(data) {
      this.$emit('tip', {
        code: data.code,
        msg: data.msg
      })
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

  .introduce {
    width: 100%;
    text-align: center;

    &-title{
      font-size: 36px;
      margin: 100px 0;
    }

    &-desc {
      font-size: 24px;
      color: #789;
      font-weight: 900;
      margin-bottom: 80px;
    }

    .item-list {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .can-item {
        margin: 0 32px;
        img{
          width: 200px;
          height: 200px;
        }
        .text{
          color: #789;
        }
      }
    }

    .back-top{
      display: inline-block;
      margin: 60px 0;
    }
  }

  .copyright{
    text-align: center;
    color: #789;
    font-size: 14px;
    line-height: 96px;
    margin: 0;
  }
}
</style>
