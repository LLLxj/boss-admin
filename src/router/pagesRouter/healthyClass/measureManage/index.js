export default [
  {
    path: 'measureManage',
    name: 'bookQuestion-measureManage',
    component (resolve) {
      require(['@/views/healthyClass/measureManage'], resolve)
    },
    meta: {
      title: '健康测评管理',
      icon: 'table'
    }
  }
]
