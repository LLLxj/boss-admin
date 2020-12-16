export default [
  {
    path: 'diseaseRiskCount',
    name: 'businessManage-diseaseRiskCount',
    component (resolve) {
      require(['@/views/businessManage/diseaseRiskCount/index'], resolve)
    },
    meta: {
      title: '疾病风险测评统计',
      icon: 'table',
      roles: [
        'disease:risk:count'
      ]
    }
  }
]
