export default [
  {
    path: 'policyQuery',
    name: 'statistics-policyQuery',
    component: () => import('@/views/statistics/policyQuery/index'),
    meta: {
      title: '保单查询',
      icon: 'table',
      roles: [
        'policyQuery'
      ]
    }
  }
]
