export default [
  {
    path: 'measurementSearch',
    name: 'statistics-measurementSearch',
    component (resolve) {
      require(['@/views/statistics/measurementSearch'], resolve)
    },
    meta: {
      title: '测评查询',
      icon: 'table',
      roles: [
        'pf:ev/list'
      ]
    }
  }
]
