export default [
  {
    path: 'audioClassify',
    name: 'memberManage-audioClassify',
    component (resolve) {
      require(['@/views/memberManage/audioClassify'], resolve)
    },
    meta: {
      title: '音频分类'
    }
  }
]
