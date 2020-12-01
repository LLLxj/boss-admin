export default [
  {
    path: 'serviceManage',
    name: 'memberManage-serviceManage',
    component (resolve) {
      require(['@/views/memberManage/serviceManage'], resolve)
    },
    meta: {
      title: '服务管理',
      icon: 'table'
    }
  }
]
