<!--
 * @Author: your name
 * @Date: 2020-03-22 22:23:52
 * @LastEditTime: 2020-03-27 23:26:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/components/CreateRoom.vue
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
                <v-text-field v-model="nickName" outlined label="请输入昵称" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-switch v-model="needPassword" class="mx-2" label="加密会议"></v-switch>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="needPassword"
                  v-model="joinPassword"
                  label="参会密码"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <small v-if="needPassword">加入会议需要会议参加码和密码</small>
            <small v-else>输入参加码即可加入会议</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large @click="dialog = false">取消</v-btn>
            <v-btn large @click="create()" :dark="true" color="#0f4c81">创建会议</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      needPassword: false,
      joinPassword: '',
      nickName:
        '编号' +
        Math.random()
          .toString()
          .substring(3, 8)
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    create() {
      console.log({
        nickName: this.nickName,
        joinPassword: this.joinPassword
      })

      // TODO: 这里应该要发请求给后台，后台创建会议保存到数据库并返回会议码，前端创建会议无法保证会议码不重复

      this.$router.push({
        name: 'Room',
        params: {
          password: this.joinPassword,
          code: Math.random()
            .toString()
            .substring(2, 8),
          name: this.nickName
        }
      })
    }
  },
  watch: {
    needPassword(val) {
      if (val) {
        this.joinPassword = Math.random()
          .toString()
          .substring(3, 8)
      }
    }
  }
}
</script>>