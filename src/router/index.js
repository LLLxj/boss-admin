import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'
import pagesRouter from './pagesRouter'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: '首页',
        icon: 'table'
      }
    }]
  }
]
export const asyncRouterMap = [...pagesRouter]

// 临时处理路由权限 全部可以访问
const allRoyterMap = constantRouterMap.concat(asyncRouterMap)
export default new Router({
  mode: 'hash', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: allRoyterMap
})
