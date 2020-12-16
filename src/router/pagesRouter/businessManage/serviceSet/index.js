export default [
  {
    path: 'serviceSet',
    name: 'businessManage-serviceSet',
    component (resolve) {
      require(['@/views/businessManage/serviceSet/index'], resolve)
    },
    meta: {
      title: '服务配置',
      icon: 'table',
      roles: [
        'mer:service/config/pagequery'
      ]
    }
  }
]
