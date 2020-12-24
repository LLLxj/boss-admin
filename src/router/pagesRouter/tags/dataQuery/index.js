export default [
  {
    path: 'dataQuery',
    name: 'tags-dataQuery',
    component (resolve) {
      require(['@/views/tags/dataQuery/index'], resolve)
    },
    meta: {
      title: '数据查询',
      icon: 'table',
      roles: [
        'prodata:selectdatapage'
      ]
    }
  }
]
