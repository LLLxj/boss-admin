export default [
  {
    path: 'cmsContent',
    name: 'cms-cmsContent-list',
    component: () => import('@/views/cms/cmsContent/index'),
    meta: {
      title: '内容管理',
      icon: 'table',
      roles: [
        'cms:content/list'
      ]
    }
  },
  {
    path: 'cmsContentDetail',
    name: 'cms-cmsContent-detail',
    component: () => import('@/views/cms/cmsContent/detail'),
    meta: {
      title: '内容管理详情',
      icon: 'table'
    }
  }
]
