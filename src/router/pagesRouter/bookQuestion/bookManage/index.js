export default [
  {
    path: 'bookManage',
    name: 'bookQuestion-bookManage',
    component (resolve) {
      require(['@/views/bookQuestion/bookManage'], resolve)
    },
    meta: {
      title: '书籍问卷管理',
      icon: 'table'
    }
  }
]
