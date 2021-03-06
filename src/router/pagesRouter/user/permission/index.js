export default [
  {
    path: 'permission',
    name: 'user-permission',
    component (resolve) {
      require(['@/views/user/permissionList'], resolve)
    },
    meta: {
      title: '权限管理',
      icon: 'table',
      roles: [
        'permission:manage'
      ]
    }
  }
]
