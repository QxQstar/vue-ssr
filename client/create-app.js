import Vue from 'vue'
import App from './app.vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import meta from 'vue-meta'
import createRouter from './config/router'
import createStore from './store/store'
import Notification from './components/notification'
import Tabs from './components/tabs'
import './assets/styles/global.styl'

Vue.use(Router)
Vue.use(Vuex)
Vue.use(Notification)
Vue.use(Tabs)
Vue.use(meta)
//
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router }
}
