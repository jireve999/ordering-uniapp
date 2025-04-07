import App from './App'
import store from './store'
import utils from "./static/ts/utils";

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$utils = utils;//将utils挂载到vue实例上，这样可以全局使用
  app.use(store); // 必须在这里使用use启用vuex
  return {
    app
  }
}
// #endif