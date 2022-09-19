import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 树形结构表格
import ZkTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 顶部进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './assets/fonts/iconfont.css'

import './assets/css/global.css'

import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 在 request 拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use((config) => {
  console.log('config', config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中结束进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table', ZkTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

// 全局过滤器
/* 过滤后台时间戳 */
Vue.filter('filterTime', function (value, format2) {
  if (!value) return
  if (value.toString().length > 10) value = parseInt(value / 1000)
  const number = value
  var format = format2 || 'Y-M-D '
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []
  var date = new Date(number * 1000)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
})

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
