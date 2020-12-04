import Vue from 'vue'
import App from './App.vue'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.scss'
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission/index.js' // 权限判断指令

Vue.config.productionTip = false

Vue.directive('permission', permission)

Vue.use(ElementUI, { size: 'medium' })

// Sentry.init({
//   Vue,
//   dsn: 'https://d8ce5845228247bf9d74123a6c048dd1@o486631.ingest.sentry.io/5544230',
//   integrations: [
//     new Integrations.BrowserTracing()
//   ],

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0
// })
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
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
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
