<!--
 * @Author: your name
 * @Date: 2020-02-23 23:54:48
 * @LastEditTime : 2020-04-07 21:42:38
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/src/components/JoinRoom.vue
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
                <v-text-field
                  v-model="nickName"
                  :rules="[() => !!nickName || '请输入昵称']"
                  label="昵称"
                  hint="您将以此身份加入会议"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="code"
                  :rules="[() => !!code || '请输入参加码']"
                  label="参加码"
                  hint="您可以向会议发起人索要参加码"
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="needPassword" cols="12">
                <v-text-field v-model="password" label="密码" type="password" required></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large @click="dialog = false">取消</v-btn>
            <v-btn style="margin-left: 20px;" large @click="join()" :dark="true" color="#0f4c81">加入</v-btn>
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
      password: '',
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
    join() {
      if (this.validate()) {
        this.$router.push({
          path: '/room',
          query: {
            code: this.code,
            password: this.password,
            name: this.nickName,
            // as the  participator
            role: 1
          }
        })
      }
    },
    validate() {
      return this.nickName && this.code
    }
  }
}
</script>>