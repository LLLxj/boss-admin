export default [
  {
    path: 'manualEvaluation',
    name: 'bussiness-manualEvaluation',
    component (resolve) {
      require(['@/views/bussiness/manualEvaluation'], resolve)
    },
    meta: {
      title: '人工测评'
    }
  }
]
