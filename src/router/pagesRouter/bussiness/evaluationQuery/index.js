export default [
  {
    path: 'evaluationQuery',
    name: 'bussiness-evaluationQuery',
    component (resolve) {
      require(['@/views/bussiness/evaluationQuery'], resolve)
    },
    meta: {
      title: '测评管理'
    }
  }
]
