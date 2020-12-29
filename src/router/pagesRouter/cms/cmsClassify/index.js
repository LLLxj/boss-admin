export default [
  {
    path: 'cmsClassify',
    name: 'cms-cmsClassify',
    component: () => import('@/views/cms/cmsClassify/index'),
    meta: {
      title: '分类管理',
      icon: 'table',
      roles: [
        'cms:category/list'
      ]
    }
  }
]
