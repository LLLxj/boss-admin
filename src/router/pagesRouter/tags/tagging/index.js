export default [
  {
    path: 'tagging',
    name: 'tags-tagging',
    component: () => import('@/views/tags/tagging/index'),
    meta: {
      title: '打标签',
      icon: 'table',
      roles: [
        'prodata:selectprodatarelpage'
      ]
    }
  },
  {
    path: 'receiveList',
    name: 'tags-receive-list',
    component: () => import('@/views/tags/tagging/receiveList'),
    meta: {
      title: '领取列表',
      icon: 'table'
    }
  },
  {
    path: 'takeTag',
    name: 'tag-take-tag',
    component: () => import('@/views/tags/tagging/takeTag'),
    meta: {
      title: '打标签',
      icon: 'table'
    }
  }
]
