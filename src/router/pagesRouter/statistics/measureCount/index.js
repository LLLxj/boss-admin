export default [
  {
    path: 'measureCount',
    name: 'statistics-measureCount',
    component (resolve) {
      require(['@/views/statistics/measureCount/index'], resolve)
    },
    meta: {
      title: '测评统计',
      icon: 'table',
      roles: [
        'pf:ev/statistical'
      ]
    }
  },
  {
    path: 'measureCountDetail',
    name: 'statistics-measureCount-detail',
    component (resolve) {
      require(['@/views/statistics/measureCount/detail'], resolve)
    },
    hidden: true,
    meta: {
      title: '测评统计详情'
    }
  }
]
