export default [
  {
    path: 'evaluationQuery',
    name: 'bussiness-evaluationQuery',
    component: () => import('@/views/bussiness/evaluationQuery'),
    meta: {
      title: '测评管理',
      icon: 'table',
      roles: [
        'role:listall'
      ]
    }
  }
]
