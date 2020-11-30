export default [
  {
    path: 'hotSearch',
    name: 'bodyCheck-hotSearch',
    component (resolve) {
      require(['@/views/bodyCheck/hotSearch'], resolve)
    },
    meta: {
      title: '测评管理'
    }
  }
]
