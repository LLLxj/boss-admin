// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import Login from '@/views/login'

// Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'About',
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login
//   }
// ]

// const router = new VueRouter({
//   mode: 'hash',
//   base: process.env.BASE_URL,
//   routes
// })

// export default router
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)

/* Layout */

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      meta: {
        title: '首页',
        icon: 'table'
      },
      component: () => import('@/views/dashboard/index')
    }]
  }

  // { path: '*', redirect: '/404', hidden: true }
]

const asyncRouterMap = [
  // {
  //   path: '/config',
  //   component: Layout,
  //   redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
  //   name: 'config',
  //   meta: {
  //     title: '站点设置',
  //     icon: 'category'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'setting',
  //       component: () => import('@/views/config/index'),
  //       meta: { title: '站点设置' }
  //     },
  //     {
  //       path: 'info',
  //       name: 'info',
  //       component: () => import('@/views/config/info'),
  //       meta: { title: '个人中心' }
  //     }
  //   ]
  // },
  {
    path: '/bussiness',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'bussiness',
    meta: {
      title: '业务管理',
      icon: 'project'
    },
    children: [
      {
        path: 'ocrConfirm',
        name: 'ocrConfirm',
        component: () => import('@/views/bussiness/ocrConfirm'),
        meta: {
          title: 'OCR确认',
          icon: 'cms'
        }
      },
      {
        path: 'manualEvaluation',
        name: 'manualEvaluation',
        component: () => import('@/views/bussiness/manualEvaluation'),
        meta: {
          title: '人工测评',
          icon: 'cms'
        }
      },
      {
        path: 'evaluationQuery',
        name: 'evaluationQuery',
        component: () => import('@/views/bussiness/evaluationQuery'),
        meta: {
          title: '测评管理',
          icon: 'cms'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'cms'
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/user/userList'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/user/roleList'),
        meta: { title: '角色管理' }
      },
      {
        path: 'permission',
        name: 'permission',
        component: () => import('@/views/user/permissionList'),
        meta: { title: '权限管理' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'statistics',
    meta: {
      title: '查询统计',
      icon: 'category'
    },
    children: [
      {
        path: 'measurementCount',
        name: 'measurementCount',
        component: () => import('@/views/statistics/measurementCount'),
        meta: { title: '测评统计' }
      },
      {
        path: 'asqCount',
        name: 'asqCount',
        component: () => import('@/views/statistics/asqCount'),
        meta: { title: '问卷统计' }
      },
      {
        path: 'measurementSearch',
        name: 'measurementSearch',
        component: () => import('@/views/statistics/measurementSearch'),
        meta: { title: '测评查询' }
      },
      {
        path: 'premiumCount',
        name: 'premiumCount',
        component: () => import('@/views/statistics/premiumCount'),
        meta: { title: '保费统计' }
      },
      {
        path: 'policyQuery',
        name: 'policyQuery',
        component: () => import('@/views/statistics/policyQuery'),
        meta: { title: '保单查询' }
      }
    ]
  },
  {
    path: '/businessManage',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'businessManage',
    meta: {
      title: '商户管理',
      icon: 'category'
    },
    children: [
      {
        path: 'businessManage',
        name: 'businessManage',
        component: () => import('@/views/businessManage/businessManagement'),
        meta: { title: '商户管理' }
      },
      {
        path: 'serviceSet',
        name: 'serviceSet',
        component: () => import('@/views/businessManage/serviceSet'),
        meta: { title: '服务配置' }
      },
      {
        path: 'diseaseRiskCount',
        name: 'diseaseRiskCount',
        component: () => import('@/views/businessManage/diseaseRiskCount'),
        meta: { title: '疾病风险测评统计' }
      }
    ]
  },
  {
    path: '/tags',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'tags',
    meta: {
      title: '打标系统',
      icon: 'category'
    },
    children: [
      {
        path: 'tagging',
        name: 'tagging',
        component: () => import('@/views/tags/tagging'),
        meta: { title: '打标签' }
      },
      {
        path: 'tagManagement',
        name: 'tagManagement',
        component: () => import('@/views/tags/tagManagement'),
        meta: { title: '标签管理' }
      },
      {
        path: 'projectManagement',
        name: 'projectManagement',
        component: () => import('@/views/tags/projectManagement'),
        meta: { title: '项目管理' }
      },
      {
        path: 'dataQuery',
        name: 'dataQuery',
        component: () => import('@/views/tags/dataQuery'),
        meta: { title: '数据查询' }
      }
    ]
  },
  {
    path: '/safe',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'safe',
    meta: {
      title: '安全云脑',
      icon: 'category'
    },
    children: [
      {
        path: 'dataValidation',
        name: 'dataValidation',
        component: () => import('@/views/safe/dataValidation'),
        meta: { title: '数据验证', icon: 'cms' }
      }
    ]
  },
  {
    path: '/cms',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'cms',
    meta: {
      title: 'CMS',
      icon: 'category'
    },
    children: [
      {
        path: 'cmsContent',
        name: 'cmsContent',
        component: () => import('@/views/cms/cmsContent'),
        meta: { title: '内容管理' }
      },
      {
        path: 'cmsClassify',
        name: 'cmsClassify',
        component: () => import('@/views/cms/cmsClassify'),
        meta: { title: '分类管理' }
      }
    ]
  },
  {
    path: '/pinecone',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'pinecone',
    meta: {
      title: '松果医服',
      icon: 'category'
    },
    children: [
      {
        path: 'contentManage',
        name: 'contentManage',
        component: () => import('@/views/pinecone/contentManage'),
        meta: { title: '内容管理' }
      },
      {
        path: 'insuranceDemand',
        name: 'insuranceDemand',
        component: () => import('@/views/pinecone/insuranceDemand'),
        meta: { title: '保险需求' }
      }
    ]
  },
  {
    path: '/autodiagnostic',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'autodiagnostic',
    meta: {
      title: '自诊系统',
      icon: 'category'
    },
    children: [
      {
        path: 'autognosisPM',
        name: 'autognosisPM',
        component: () => import('@/views/autodiagnostic/projectManage'),
        meta: { title: '自诊项目管理' }
      },
      {
        path: 'insuranceDemand',
        name: 'insuranceDemand',
        component: () => import('@/views/autodiagnostic/categotyManage'),
        meta: { title: '自诊分类管理' }
      }
    ]
  },
  {
    path: '/bookQuestion',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'bookQuestion',
    meta: {
      title: '书籍问卷',
      icon: 'category'
    },
    children: [
      {
        path: 'autognosisPM',
        name: 'autognosisPM',
        component: () => import('@/views/bookQuestion/bookManage'),
        meta: { title: '书籍问卷管理' }
      },
      {
        path: 'insuranceDemand',
        name: 'insuranceDemand',
        component: () => import('@/views/autodiagnostic/categotyManage'),
        meta: { title: '书籍问卷分类管理' }
      }
    ]
  },
  {
    path: '/healthyClass',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'healthyClass',
    meta: {
      title: '健康星球',
      icon: 'category'
    },
    children: [
      {
        path: 'measureManage',
        name: 'measureManage',
        component: () => import('@/views/healthyClass/measureManage'),
        meta: { title: '健康测评管理' }
      },
      {
        path: 'categoryManage',
        name: 'categoryManage',
        component: () => import('@/views/healthyClass/categoryManage'),
        meta: { title: '健康分类管理' }
      }
    ]
  },
  {
    path: '/memberManage',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'memberManage',
    meta: {
      title: '会员服务管理',
      icon: 'category'
    },
    children: [
      {
        path: 'memberSet',
        name: 'memberSet',
        component: () => import('@/views/memberManage/memberSet'),
        meta: { title: '会员设置' }
      },
      {
        path: 'serviceManage',
        name: 'serviceManage',
        component: () => import('@/views/memberManage/serviceManage'),
        meta: { title: '服务管理' }
      },
      {
        path: 'channelService',
        name: 'channelService',
        component: () => import('@/views/memberManage/channelService'),
        meta: { title: '渠道服务管理' }
      },
      {
        path: 'audioList',
        name: 'audioList',
        component: () => import('@/views/memberManage/audioList'),
        meta: { title: '音频列表' }
      },
      {
        path: 'audioClassify',
        name: 'audioClassify',
        component: () => import('@/views/memberManage/audioClassify'),
        meta: { title: '音频分类' }
      },
      {
        path: 'videoList',
        name: 'videoList',
        component: () => import('@/views/memberManage/videoList'),
        meta: { title: '视频列表' }
      },
      {
        path: 'videoClassify',
        name: 'videoClassify',
        component: () => import('@/views/memberManage/videoClassify'),
        meta: { title: '音频分类' }
      }
    ]
  },
  {
    path: '/bodyCheck',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'bodyCheck',
    meta: {
      title: '体检查查',
      icon: 'category'
    },
    children: [
      {
        path: 'inspectionProject',
        name: 'inspectionProject',
        component: () => import('@/views/bodyCheck/inspectionProject'),
        meta: { title: '检验项目' }
      },
      {
        path: 'serviceManage',
        name: 'serviceManage',
        component: () => import('@/views/bodyCheck/checkProject'),
        meta: { title: '检查项目' }
      },
      {
        path: 'channelService',
        name: 'channelService',
        component: () => import('@/views/bodyCheck/hotSearch'),
        meta: { title: '热门搜索' }
      }
    ]
  },
  {
    path: '/activies',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'activies',
    meta: {
      title: '活动管理',
      icon: 'category'
    },
    children: [
      {
        path: 'mask',
        name: 'mask',
        component: () => import('@/views/activities/mask'),
        meta: { title: '口罩活动', icon: 'cms' }
      }
    ]
  }
  // {
  //   path: '/article',
  //   component: Layout,
  //   redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
  //   name: 'article',
  //   meta: {
  //     title: '文章管理',
  //     icon: 'cms'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'articleList',
  //       component: () => import('@/views/article/index'),
  //       meta: { title: '文章列表' }
  //     },
  //     {
  //       path: 'add',
  //       name: 'addArticle',
  //       component: () => import('@/views/article/add'),
  //       meta: { title: '新增文章' }
  //     },
  //     {
  //       path: 'edit',
  //       name: 'editArticle',
  //       hidden: true,
  //       component: () => import('@/views/article/add'),
  //       meta: { title: '编辑文章' }
  //     }
  //   ]
  // },
  // {
  //   path: '/activity',
  //   component: Layout,
  //   redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
  //   name: 'activity',
  //   meta: {
  //     title: '活动管理',
  //     icon: 'category'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'activityList',
  //       component: () => import('@/views/activity/index'),
  //       meta: { title: '活动列表', icon: 'cms' }
  //     },
  //     {
  //       path: 'add',
  //       name: 'addActivity',
  //       component: () => import('@/views/activity/add'),
  //       meta: { title: '新增活动', icon: 'cms' }
  //     },
  //     {
  //       path: 'edit',
  //       name: 'editActivity',
  //       hidden: true,
  //       component: () => import('@/views/activity/add'),
  //       meta: { title: '编辑活动', icon: 'cms' }
  //     }
  //   ]
  // }
]
// 临时处理路由权限 全部可以访问
const allRoyterMap = constantRouterMap.concat(asyncRouterMap)
export default new Router({
  mode: 'hash', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: allRoyterMap
})
