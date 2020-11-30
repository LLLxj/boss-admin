export default [
  {
    path: 'measurementCount',
    name: 'statistics-measurementCount',
    component (resolve) {
      require(['@/views/statistics/measurementCount'], resolve)
    },
    meta: {
      title: '测评统计'
    }
  }
]
