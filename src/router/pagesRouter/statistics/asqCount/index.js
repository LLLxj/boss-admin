export default [
  {
    path: 'asqCount',
    name: 'statistics-asqCount',
    component (resolve) {
      require(['@/views/statistics/asqCount'], resolve)
    },
    meta: {
      title: '问卷统计'
    }
  }
]
