export default [
  {
    path: 'contentManage',
    name: 'pinecone-contentManage',
    component (resolve) {
      require(['@/views/pinecone/contentManage'], resolve)
    },
    meta: {
      title: '内容管理',
      icon: 'table'
    }
  }
]
