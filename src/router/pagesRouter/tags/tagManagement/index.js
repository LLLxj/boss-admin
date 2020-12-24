export default [
  {
    path: 'tagManagement',
    name: 'tags-tagManagement',
    component: () => import('@/views/tags/tagManagement/index'),
    meta: {
      title: '标签管理',
      icon: 'table',
      roles: [
        'label:selectlabellist'
      ]
    }
  }
]
