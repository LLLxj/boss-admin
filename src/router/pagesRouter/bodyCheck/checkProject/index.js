export default [
  {
    path: 'checkProject',
    name: 'bodyCheck-checkProject',
    component (resolve) {
      require(['@/views/bodyCheck/checkProject'], resolve)
    },
    meta: {
      title: '检查项目'
    }
  }
]
