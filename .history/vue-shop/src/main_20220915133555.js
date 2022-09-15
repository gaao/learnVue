import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import axios from 'axios'

import './assets/css/global.css'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
