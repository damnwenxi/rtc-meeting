<!--
 * @Author: your name
 * @Date: 2020-02-23 23:54:48
 * @LastEditTime: 2020-03-22 22:57:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/src/components/JoinRoom.vue
 -->
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-container>
          <v-card-title>
            <span class="headline">输入参加码加入会议</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="code" outlined label="参加码" required></v-text-field>
              </v-col>
              <v-col v-if="needPassword" cols="12">
                <v-text-field v-model="password" outlined label="密码" type="password" required></v-text-field>
              </v-col>
            </v-row>
            <small>*您可以向会议发起人索要参加码和密码</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large @click="dialog = false">取消</v-btn>
            <v-btn large @click="join()" :dark="true" color="#0f4c81">加入</v-btn>
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
      code: '',
      password: ''
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    join() {
      if (this.validate()) {
        this.needPassword = true
      }
    },
    validate() {
      return true
    }
  }
}
</script>>