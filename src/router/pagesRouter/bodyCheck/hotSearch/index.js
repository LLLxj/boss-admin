export default [
  {
    path: 'hotSearch',
    name: 'bodyCheck-hotSearch',
    component (resolve) {
      require(['@/views/bodyCheck/hotSearch'], resolve)
    },
    meta: {
      title: '热门搜索',
      icon: 'table',
      roles: [
        'hotSearch:list'
      ]
    }
  }
]
