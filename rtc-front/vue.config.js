/*
 * @Author: your name
 * @Date: 2020-03-06 23:09:14
 * @LastEditTime: 2020-03-31 23:19:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /rtc-meeting/rtc-front/vue.config.js
 */
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',    //源地址 
        changeOrigin: true,    //改变源 
        ws: true,
        pathRewrite: {
          '^/api': '' //路径重写 
        }
      }
    }
  }
}