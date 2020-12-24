export default [
  {
    path: 'measureSearch',
    name: 'statistics-measureSearch',
    component: () => import('@/views/statistics/measureSearch/index'),
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
    component: () => import('@/views/statistics/measureSearch/detail'),
    hidden: true,
    meta: {
      title: '测评查询详情',
      roles: [
      ]
    }
  }
]
