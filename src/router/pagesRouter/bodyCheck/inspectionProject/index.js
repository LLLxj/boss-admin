export default [
  {
    path: 'inspectionProject',
    name: 'bodyCheck-inspectionProject',
    component (resolve) {
      require(['@/views/bodyCheck/inspectionProject'], resolve)
    },
    meta: {
      title: '检验项目'
    }
  }
]
