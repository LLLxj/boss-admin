export default [
  {
    path: 'hotSearch',
    name: 'bodyCheck-hotSearch',
    component: () => import('@/views/bodyCheck/hotSearch'),
    meta: {
      title: '热门搜索',
      icon: 'table',
      roles: [
        'hotSearch:list'
      ]
    }
  }
]
