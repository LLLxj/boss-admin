export default [
  {
    path: 'dataQuery',
    name: 'tags-dataQuery',
    component (resolve) {
      require(['@/views/tags/dataQuery'], resolve)
    },
    meta: {
      title: '数据查询',
      icon: 'table'
    }
  }
]
