export default [
  {
    path: 'cmsContent',
    name: 'cms-cmsContent',
    component (resolve) {
      require(['@/views/cms/cmsContent'], resolve)
    },
    meta: {
      title: '内容管理',
      icon: 'table'
    }
  }
]
