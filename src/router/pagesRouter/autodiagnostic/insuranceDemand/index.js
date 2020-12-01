export default [
  {
    path: 'insuranceDemand',
    name: 'autodiagnostic-insuranceDemand',
    component (resolve) {
      require(['@/views/autodiagnostic/categotyManage'], resolve)
    },
    meta: {
      title: '数据查询',
      icon: 'table'
    }
  }
]
