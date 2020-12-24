export default [
  {
    path: 'serviceSet',
    name: 'businessManage-serviceSet',
    component: () => import('@/views/businessManage/serviceSet/index'),
    meta: {
      title: '服务配置',
      icon: 'table',
      roles: [
        'mer:service/config/pagequery'
      ]
    }
  }
]
