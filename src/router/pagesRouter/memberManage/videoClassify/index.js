export default [
  {
    path: '/memberManage/videoClassify',
    name: 'memberManage-videoClassify',
    component (resolve) {
      require(['@/views/memberManage/videoClassify'], resolve)
    },
    meta: {
      title: '音频分类',
      icon: 'table'
    }
  }
]
