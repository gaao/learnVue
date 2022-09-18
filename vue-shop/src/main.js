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

import './assets/fonts/iconfont.css'

import './assets/css/global.css'

import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false
Vue.component('tree-table', ZkTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
