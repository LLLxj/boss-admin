export default [
  {
    path: 'mask',
    name: 'activities-mask',
    component: () => import('@/views/activities/mask/index'),
    meta: {
      title: '口罩活动',
      icon: 'table',
      roles: [
        'activities:mask:list'
      ]
    }
  },
  {
    path: 'mask/detail',
    name: 'activities-mask-detail',
    component: () => import('@/views/activities/mask/detail'),
    hidden: true,
    meta: {
      title: '口罩活动详情',
      icon: 'table',
      roles: [
      ]
    }
  }
]
