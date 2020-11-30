export default [
  {
    path: 'audioList',
    name: 'memberManage-audioList',
    component (resolve) {
      require(['@/views/memberManage/audioList'], resolve)
    },
    meta: {
      title: '音频列表'
    }
  }
]
