export default [
  {
    path: 'policyQuery',
    name: 'statistics-policyQuery',
    component (resolve) {
      require(['@/views/statistics/policyQuery'], resolve)
    },
    meta: {
      title: '保单查询'
    }
  }
]
