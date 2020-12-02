import Vue from 'vue'
import App from './App.vue'
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
