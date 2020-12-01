export default [
  {
    path: 'tagging',
    name: 'tags-tagging',
    component (resolve) {
      require(['@/views/tags/tagging'], resolve)
    },
    meta: {
      title: '打标签',
      icon: 'table'
    }
  }
]
