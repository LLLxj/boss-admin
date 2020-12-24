export default [
  {
    path: 'tagging',
    name: 'tags-tagging',
    component (resolve) {
      require(['@/views/tags/tagging/index'], resolve)
    },
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
    component (resolve) {
      require(['@/views/tags/tagging/receiveList'], resolve)
    },
    meta: {
      title: '领取列表',
      icon: 'table'
    }
  },
  {
    path: 'takeTag',
    name: 'tag-take-tag',
    component (resolve) {
      require(['@/views/tags/tagging/takeTag'], resolve)
    },
    meta: {
      title: '打标签',
      icon: 'table'
    }
  }
]
