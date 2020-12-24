export default [
  {
    path: 'businessManagement',
    name: 'businessManage-businessManagement',
    component: () => import('@/views/businessManage/businessManage/index'),
    meta: {
      title: '商户管理',
      icon: 'table',
      roles: [
        'mer:pagelist'
      ]
    }
  },
  {
    path: 'businessManagementDetail',
    name: 'businessManage-businessManagement-detail',
    component: () => import('@/views/businessManage/businessManage/detail'),
    hidden: true,
    meta: {
      title: '商户管理详情',
      icon: 'table'
    }
  }
]
