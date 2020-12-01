export default [
  {
    path: 'premiumCount',
    name: 'statistics-premiumCount',
    component (resolve) {
      require(['@/views/statistics/premiumCount'], resolve)
    },
    meta: {
      title: '保费统计',
      icon: 'table'
    }
  }
]
