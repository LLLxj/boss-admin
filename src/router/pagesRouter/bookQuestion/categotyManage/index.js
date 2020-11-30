export default [
  {
    path: 'categotyManage',
    name: 'bookQuestion-categotyManage',
    component (resolve) {
      require(['@/views/bookQuestion/categoryManage'], resolve)
    },
    meta: {
      title: '书籍问卷分类管理'
    }
  }
]
