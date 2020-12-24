export default [
  {
    path: 'tagManagement',
    name: 'tags-tagManagement',
    component (resolve) {
      require(['@/views/tags/tagManagement/index'], resolve)
    },
    meta: {
      title: '标签管理',
      icon: 'table',
      roles: [
        'label:selectlabellist'
      ]
    }
  }
]
