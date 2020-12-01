export default [
  {
    path: 'projectManagement',
    name: 'tags-projectManagement',
    component (resolve) {
      require(['@/views/tags/projectManagement'], resolve)
    },
    meta: {
      title: '项目管理',
      icon: 'table'
    }
  }
]
