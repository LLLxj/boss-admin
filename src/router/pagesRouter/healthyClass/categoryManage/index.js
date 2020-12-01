export default [
  {
    path: 'categoryManage',
    name: 'healthyClass-categoryManage',
    component (resolve) {
      require(['@/views/healthyClass/categoryManage'], resolve)
    },
    meta: {
      title: '健康分类管理',
      icon: 'table'
    }
  }
]
