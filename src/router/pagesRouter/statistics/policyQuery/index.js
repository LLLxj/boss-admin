export default [
  {
    path: 'policyQuery',
    name: 'statistics-policyQuery',
    component (resolve) {
      require(['@/views/statistics/policyQuery/index'], resolve)
    },
    meta: {
      title: '保单查询',
      icon: 'table',
      roles: [
        'policyQuery'
      ]
    }
  }
]
