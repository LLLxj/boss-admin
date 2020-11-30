export default [
  {
    path: 'tagManagement',
    name: 'tags-tagManagement',
    component (resolve) {
      require(['@/views/tags/tagManagement'], resolve)
    },
    meta: {
      title: '标签管理'
    }
  }
]
