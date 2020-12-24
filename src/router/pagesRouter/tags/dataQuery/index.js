export default [
  {
    path: 'dataQuery',
    name: 'tags-dataQuery',
    component: () => import('@/views/tags/dataQuery/index'),
    meta: {
      title: '数据查询',
      icon: 'table',
      roles: [
        'prodata:selectdatapage'
      ]
    }
  }
]
