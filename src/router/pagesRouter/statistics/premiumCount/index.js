export default [
  {
    path: 'premiumCount',
    name: 'statistics-premiumCount',
    component: () => import('@/views/statistics/premiumCount/index'),
    meta: {
      title: '保费统计',
      icon: 'table',
      roles: [
        'pf:premium/statistical'
      ]
    }
  },
  {
    path: 'premiumCountDetail',
    name: 'statistics-premiumCount-detail',
    component: () => import('@/views/statistics/premiumCount/detail'),
    hidden: true,
    meta: {
      title: '保费统计详情',
      icon: 'table',
      roles: [
      ]
    }
  },
  {
    path: 'premiumList',
    name: 'statistics-premiumList-list',
    component: () => import('@/views/statistics/premiumCount/premiumList'),
    hidden: true,
    meta: {
      title: '清单详情',
      icon: 'table',
      roles: [
      ]
    }
  }
]
