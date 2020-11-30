export default [
  {
    path: 'role',
    name: 'user-role',
    component (resolve) {
      require(['@/views/user/roleList'], resolve)
    },
    meta: {
      title: '角色管理'
    }
  }
]
