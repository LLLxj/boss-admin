export default [
  {
    path: 'measureCount',
    name: 'statistics-measureCount',
    component: () => import('@/views/statistics/measureCount/index'),
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
    component: () => import('@/views/statistics/measureCount/detail'),
    hidden: true,
    meta: {
      title: '测评统计详情'
    }
  }
]
