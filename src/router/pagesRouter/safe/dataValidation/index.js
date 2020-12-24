export default [
  {
    path: 'dataValidation',
    name: 'safe-data-validation',
    component (resolve) {
      require(['@/views/safe/dataValidation'], resolve)
    },
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
    component (resolve) {
      require(['@/views/safe/dataScore'], resolve)
    },
    meta: {
      title: '数据打分',
      icon: 'table'
    }
  }
]
