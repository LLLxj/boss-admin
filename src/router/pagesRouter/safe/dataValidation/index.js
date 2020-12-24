export default [
  {
    path: 'dataValidation',
    name: 'safe-data-validation',
    component: () => import('@/views/safe/dataValidation'),
    meta: {
      title: '数据验证',
      icon: 'table',
      roles: [
        'dataValidation'
      ]
    }
  },
  {
    path: 'dataScore',
    name: 'safe-data-score',
    component: () => import('@/views/safe/dataScore'),
    meta: {
      title: '数据打分',
      icon: 'table'
    }
  }
]
