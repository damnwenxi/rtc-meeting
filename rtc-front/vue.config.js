/*
 * @Author: your name
 * @Date: 2020-03-06 23:09:14
 * @LastEditTime : 2020-05-07 21:04:12
 * @LastEditors  : kefeng
 * @Description: In User Settings Edit
 * @FilePath     : /rtc-meeting/rtc-front/vue.config.js
 */

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: './',
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',    //源地址 
        changeOrigin: true,    //改变源 
        ws: true,
        pathRewrite: {
          '^/api': '' //路径重写 
        }
      }
    }
  }
}