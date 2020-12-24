export default [
  {
    path: 'userList',
    name: 'user-list',
    component: () => import('@/views/user/userList'),
    meta: {
      title: '用户管理',
      icon: 'table',
      roles: [
        'user:manage'
      ]
    }
  }
]
