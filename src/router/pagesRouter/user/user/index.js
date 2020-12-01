export default [
  {
    path: 'userList',
    name: 'user-list',
    component (resolve) {
      require(['@/views/user/userList'], resolve)
    },
    meta: {
      title: '用户管理',
      icon: 'table'
    }
  }
]
