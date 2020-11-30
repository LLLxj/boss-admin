export default [
  {
    path: 'channelService',
    name: 'memberManage-channelService',
    component (resolve) {
      require(['@/views/memberManage/channelService'], resolve)
    },
    meta: {
      title: '渠道服务管理'
    }
  }
]
