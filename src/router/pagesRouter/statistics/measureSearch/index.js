export default [
  {
    path: 'measureSearch',
    name: 'statistics-measureSearch',
    component (resolve) {
      require(['@/views/statistics/measureSearch/index'], resolve)
    },
    meta: {
      title: '测评查询',
      icon: 'table',
      roles: [
        'pf:ev/list'
      ]
    }
  },
  {
    path: 'measureSearchDetail',
    name: 'statistics-measureSearch-detail',
    component (resolve) {
      require(['@/views/statistics/measureSearch/detail'], resolve)
    },
    hidden: true,
    meta: {
      title: '测评查询详情',
      roles: [
      ]
    }
  }
]
