export default [
  {
    path: '/memberManage/videoList',
    name: 'memberManage-videoList',
    component: () => import('@/views/memberManage/videoList'),
    meta: {
      title: '视频列表',
      icon: 'table'
    }
  }
]
