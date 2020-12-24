export default [
  {
    path: 'permission',
    name: 'user-permission',
    component: () => import('@/views/user/permissionList'),
    meta: {
      title: '权限管理',
      icon: 'table',
      roles: [
        'permission:manage'
      ]
    }
  }
]
