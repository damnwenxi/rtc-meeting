<!--
 * @Author: your name
 * @Date: 2020-03-22 22:23:52
 * @LastEditTime : 2020-05-08 22:29:23
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/components/CreateRoom.vue
 -->
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-container>
          <v-card-title>
            <span class="headline">创建会议</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  :rules="[() => !!title || '请输入会议名称']"
                  label="会议名称"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nickName"
                  :rules="[() => !!nickName || '请输入昵称']"
                  label="昵称"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-switch v-model="needPassword" class="mx-2" label="需要密码"></v-switch>
              </v-col>
              <v-col cols="6">
                <v-text-field v-if="needPassword" v-model="joinPassword" label="密码"></v-text-field>
              </v-col>
            </v-row>
            <small v-if="needPassword">加入会议需要会议参加码和密码</small>
            <small v-else>输入参加码即可加入会议</small>
          </v-card-text>
          <v-card-actions>
            <span v-if="errorMsg" class="error-tip">
              {{errorMsg}}
            </span>
            <v-spacer></v-spacer>
            <v-btn large @click="dialog = false">取消</v-btn>
            <v-btn
              style="margin-left: 20px;"
              large
              @click="create()"
              :dark="true"
              color="#0f4c81"
            >创建会议</v-btn>
            <v-btn
              style="margin-left: 20px;"
              large
              @click="create(true)"
              :dark="true"
              color="#0f4c81"
            >分享屏幕</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { createRoom } from '../service/service'
export default {
  data() {
    return {
      dialog: false,
      needPassword: false,
      joinPassword: '',
      title: '',
      errorMsg: '',
      nickName:
        '用户' +
        Math.random()
          .toString()
          .substring(3, 8)
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    create(flag) {
      if (!this.nickName) {
        this.errorMsg = '请输入昵称'
        return
      }
      if (!this.title) {
        this.errorMsg = '请输入会议名称'
        return
      }
      if (this.needPassword && !this.joinPassword) {
        this.errorMsg = '请输入会议密码'
        return
      }
      createRoom({
        owner: 'hhh',
        owner_id: '123',
        title: this.title,
        need_password: this.needPassword,
        password: this.joinPassword
      }).then(response => {
        let res = response.data
        if (res.code === 0 && res.data && res.data.code) {
          this.$router.push({
            path: '/room',
            query: {
              password: this.joinPassword || '',
              code: res.data.code,
              name: flag?this.nickName+'的屏幕':this.nickName,
              // as the initiator
              title: this.title,
              role: 0,
              type: flag?'screen':''
            }
          })
        } else {
          this.$emit('tip', {
            code: res.data.code,
            msg: res.data.msg
          })
        }
      }).catch(res => {
        if(res.status == 401){
          this.$emit('tip', {
            code: -1,
            msg: '登录信息已过期，请重新登录'
          })
        }
      })
    }
  },
  watch: {
    errorMsg(val) {
      if (val) {
        setTimeout(() => {
          this.errorMsg = ''
        }, 3000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.error-tip{
  color: red;
}
</style>