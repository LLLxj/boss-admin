export default [
  {
    path: 'asqCount',
    name: 'statistics-asqCount',
    component (resolve) {
      require(['@/views/statistics/asqCount/index'], resolve)
    },
    meta: {
      title: '问卷统计',
      icon: 'table',
      roles: [
        'pf:qa/statistics'
      ]
    }
  },
  {
    path: 'asqCountDetail',
    name: 'statistics-asqCount-detail',
    component (resolve) {
      require(['@/views/statistics/asqCount/detail'], resolve)
    },
    hidden: true,
    meta: {
      title: '问卷统计详情',
      icon: 'table',
      roles: [
      ]
    }
  }
]
