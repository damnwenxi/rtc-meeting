<!--
 * @Date         : 2020-04-16 12:11:38
 * @Author       : kefeng
 * @LastEditors  : kefeng
 * @LastEditTime : 2020-04-17 22:33:06
 * @FilePath     : /rtc-meeting/rtc-front/src/components/FileManager.vue
 -->
<template>
  <div class="file-manager">
    <p class="file-title">文件管理
      <span @click="close()" class="file-close">X</span>
    </p>
    <v-simple-table dark>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">上传用户</th>
            <th class="text-left">文件名</th>
            <th class="text-left">大小</th>
            <th class="text-left">上传时间</th>
            <th class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in fileList" :key="item.upload_date">
            <td>{{ item.id }}</td>
            <td>{{ item.from }}</td>
            <td>{{ item.filename }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.upload_date }}</td>
            <td>
              <span class="download-btn" @click="download(item.id)">下载</span>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="send">
      <v-file-input v-model="selectFile" dark show-size label="选择文件"></v-file-input>
      <span v-if="selectFile" @click="send" class="send-btn">
        发送文件
      </span>
      <p class="send-tip">
        *支持50M以下文件点对点传输
      </p>
    </div>
  </div>
</template>

<script>
import socket from '../dep/socket'
import {mapGetters} from 'vuex'
export default {
  props: ['pcList'],
  data(){
    return {
      fileList:[],
      selectFile: null,
      
    }
  },
  watch: {
    pcList: {
      deep: true,
      handler: function(list) {
        list.forEach(item => {
          item.pc.addEventListener('datachannel', event => {
            let receiveChannel = event.channel;
            receiveChannel.binaryType = 'arraybuffer';
            receiveChannel.onmessage = event => {
              // 查找出此连接下的file并更新
              let currentFile = this.findCurrentFile(item.number)
              currentFile.receiveBuffer.push(event.data)
              currentFile.receivedSize += event.data.byteLength
              // 文件传输完成
              if (currentFile.receivedSize === currentFile.size) {
                const received = new Blob(currentFile.receiveBuffer);
                currentFile.downloadUrl = URL.createObjectURL(received);
                receiveChannel.close()
              }
            }
            // receiveChannel.onopen = onReceiveChannelStateChange;
            // receiveChannel.onclose = onReceiveChannelStateChange;
          })
        })
      }
    }
  },
  created(){
  
    // 监听一下wss
    socket.on('message', data => {
      if (data.type === 'send_file_res') {
        console.log(data)
        // 无论是发送者还是接收者都要把文件加入列表
        this.fileList.push({
          from: data.from,
          upload_date: data.time,
          receivedSize: 0,
          size: data.file_size,
          filename: data.file_name,
          id: data.number,
          // 用来存储文件
          receiveBuffer: []
        })
        // 如果是自己要发送文件，需要在这里开始通过rtc发送
        if (data.number === this.user.number) {
          this.sendFileByRtc()
        }
      }
    })
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    findCurrentFile(number){
      return this.fileList.filter(item => {
        return item.id === number
      })[0]
    }, 
    download(id) {
      console.log(id)
    },
    close() {
      this.$emit('close')
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
    },
    sendFileByRtc() {
      const chunkSize = 16384;
      let fileReader = new FileReader();
      let offset = 0;
      fileReader.addEventListener('error', error => console.error('Error reading file:', error));
      fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
      fileReader.addEventListener('load', e => {
        console.log('FileRead.onload ', e);
        this.pcList.forEach(item => {
          console.log(item)
          item.sendChannel.send(e.target.result)
          offset += e.target.result.byteLength;
          // sendProgress.value = offset;
          if (offset < this.selectFile.size) {
            readSlice(offset);
          }
        })        
      });
      const readSlice = o => {
        console.log('readSlice ', o);
        console.log(this.selectFile)
        const slice = this.selectFile.slice(offset, o + chunkSize);
        fileReader.readAsArrayBuffer(slice);
      };
      readSlice(0);
    },
    send() {
      console.log('333')
      if (!this.selectFile) {
        return
      }
      const file = this.selectFile

      // 通过rtc发送文件前先通过wss发送文件信息给远端
      socket.send({
        type: 'send_file',
        from: this.user.name,
        time: this.getTime(),
        file_size: file.size,
        file_name: file.name,
        room_id: this.user.code,
        number: this.user.number
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.file-manager {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  min-height: 320px;
  min-width: 480px;
  height: 60%;
  width: 60%;
  background: #1E1E1E;
  color: #fff;
  z-index: 2;

  .file-title {
    margin: 0;
    padding: 16px;

    .file-close{
      float: right;
      cursor: pointer;

      &:hover{
        color: #0f4c81;
      }
    }
  }

  .download-btn {
    background: #0f4c81;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .send {
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    text-align: center;

    .send-btn {
      font-size: 16px;
      background: #0f4c81;
      padding: 5px 20px;
      border-radius: 4px;
      cursor: pointer;
    }

    .send-tip{
      font-size: 12px;
      margin: 0;
      margin-top: 10px;
    }
  }
}
</style>