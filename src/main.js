import Vue from 'vue'
import App from './App.vue'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import router from './router'
import store from './store'
import '@/plugins/element.js'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.scss'
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission/index.js' // 权限判断指令
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false

Vue.directive('permission', permission)
// 图片预览

Vue.use(Viewer)
Viewer.setDefaults({
  Options: { inline: true, button: true, navbar: true, title: true, toolbar: true, tooltip: true, movable: true, zoomable: true, rotatable: true, scalable: true, transition: true, fullscreen: true, keyboard: true, url: 'data-source' }
})

Vue.use(ElementUI, { size: 'medium' })
if (process.env.NODE_ENV) {
  //  可设置用户信息用于定位筛选
  Sentry.setUser({
    id: 'lzj',
    username: 'lzj',
    email: '253358001@qq.com',
    testKey: '自定义的key'
  })
  Sentry.init({
    dsn: process.env.VUE_APP_DSN,
    environment: process.env.NODE_ENV,
    Vue,
    logErrors: true, // 保留原Vue渲染器中发生的错误将显示在开发人员控制台中
    integrations: [new Integrations.BrowserTracing()],
    release: process.env.VUE_APP_RELEASE_VERSION,
    tracesSampleRate: 1.0,
    tracingOptions: {
      trackComponents: true
    }
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
