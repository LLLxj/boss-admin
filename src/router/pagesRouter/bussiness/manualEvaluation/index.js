export default [
  {
    path: 'manualEvaluation',
    name: 'bussiness-manualEvaluation',
    component: () => import('@/views/bussiness/manualEvaluation'),
    meta: {
      title: '人工测评',
      icon: 'table',
      roles: [
        'ev:auditlist'
      ]
    }
  }
]
