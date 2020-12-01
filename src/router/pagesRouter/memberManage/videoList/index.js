export default [
  {
    path: '/memberManage/videoList',
    name: 'memberManage-videoList',
    component (resolve) {
      require(['@/views/memberManage/videoList'], resolve)
    },
    meta: {
      title: '视频列表',
      icon: 'table'
    }
  }
]
