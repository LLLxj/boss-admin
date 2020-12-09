export default [
  {
    path: 'premiumCount',
    name: 'statistics-premiumCount',
    component (resolve) {
      require(['@/views/statistics/premiumCount/index'], resolve)
    },
    meta: {
      title: '保费统计',
      icon: 'table',
      roles: [
        'pf:premium/statistical'
      ]
    }
  },
  {
    path: 'premiumCountDetail',
    name: 'statistics-premiumCount-detail',
    component (resolve) {
      require(['@/views/statistics/premiumCount/detail'], resolve)
    },
    hidden: true,
    meta: {
      title: '保费统计详情',
      icon: 'table',
      roles: [
      ]
    }
  },
  {
    path: 'premiumList',
    name: 'statistics-premiumList-list',
    component (resolve) {
      require(['@/views/statistics/premiumCount/premiumList'], resolve)
    },
    hidden: true,
    meta: {
      title: '清单详情',
      icon: 'table',
      roles: [
      ]
    }
  }
]
