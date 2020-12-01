export default [
  {
    path: 'cmsClassify',
    name: 'cms-cmsClassify',
    component (resolve) {
      require(['@/views/cms/cmsClassify'], resolve)
    },
    meta: {
      title: '分类管理',
      icon: 'table'
    }
  }
]
