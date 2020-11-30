export default [
  {
    path: '/memberManage/memberSet',
    name: 'memberManage-memberSet',
    component (resolve) {
      require(['@/views/memberManage/memberSet'], resolve)
    },
    meta: {
      title: '会员设置'
    }
  }
]
