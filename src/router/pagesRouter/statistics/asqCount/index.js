export default [
  {
    path: 'asqCount',
    name: 'statistics-asqCount',
    component: () => import('@/views/statistics/asqCount/index'),
    meta: {
      title: '问卷统计',
      icon: 'table',
      roles: [
        'pf:qa/statistics'
      ]
    }
  },
  {
    path: 'asqCountDetail',
    name: 'statistics-asqCount-detail',
    component: () => import('@/views/statistics/asqCount/detail'),
    hidden: true,
    meta: {
      title: '问卷统计详情',
      icon: 'table',
      roles: [
      ]
    }
  }
]
