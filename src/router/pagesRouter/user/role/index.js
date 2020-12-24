export default [
  {
    path: 'role',
    name: 'user-role',
    component: () => import('@/views/user/roleList'),
    meta: {
      title: '角色管理',
      icon: 'table',
      roles: [
        'roler:manage'
      ]
    }
  }
]
