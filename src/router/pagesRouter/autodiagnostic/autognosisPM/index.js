export default [
  {
    path: 'projectManage',
    name: 'autodiagnostic-projectManage',
    component (resolve) {
      require(['@/views/autodiagnostic/projectManage'], resolve)
    },
    meta: {
      title: '自诊项目管理',
      icon: 'table'
    }
  }
]
