export default [
  {
    path: 'dataValidation',
    name: 'safe-dataValidation',
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
  }
]
