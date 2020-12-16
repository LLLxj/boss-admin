export default [
  {
    path: 'businessManagement',
    name: 'businessManage-businessManagement',
    component (resolve) {
      require(['@/views/businessManage/businessManage/index'], resolve)
    },
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
    component (resolve) {
      require(['@/views/businessManage/businessManage/detail'], resolve)
    },
    hidden: true,
    meta: {
      title: '商户管理详情',
      icon: 'table'
    }
  }
]
