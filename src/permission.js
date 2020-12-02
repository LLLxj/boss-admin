import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import { Message } from 'element-ui'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      next()
      store.dispatch('GetInfo').then(res => { // 拉取用户信息
        const { code, data } = res.data
        if (code === '0000') {
          // const memuPerms = []
          // const handlePerms = []
          const perms = []
          data.permissionList.permissionList.forEach(item => {
            // if ((item.type === 0 || item.type === 1)) { // 0 一级菜单 1 二级菜单
            //   memuPerms.push(item)
            // } else if (item.type === 2) {
            //   handlePerms.push(item.permission)
            // }
            if (item.permission) {
              perms.push(item.permission)
            }
          })
          // store.dispatch('GenerateRoutes', { memuPerms, handlePerms }).then(() => { // 根据perms权限生成可访问的路由表
          store.dispatch('GenerateRoutes', { perms }).then(() => { // 根据perms权限生成可访问的路由表
            // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }
        next()
      }).catch((err) => {
        store.dispatch('FedLogOut').then(() => {
          Message.error(err || 'Verification failed, please login again')
          next({ path: '/' })
        })
      })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
