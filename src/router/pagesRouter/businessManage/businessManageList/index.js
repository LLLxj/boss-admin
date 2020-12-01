export default [
  {
    path: 'businessManagement',
    name: 'businessManage-businessManagement',
    component (resolve) {
      require(['@/views/businessManage/businessManagement'], resolve)
    },
    meta: {
      title: '商户管理',
      icon: 'table'
    }
  }
]
