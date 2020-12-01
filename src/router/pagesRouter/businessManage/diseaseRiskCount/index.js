export default [
  {
    path: 'diseaseRiskCount',
    name: 'businessManage-diseaseRiskCount',
    component (resolve) {
      require(['@/views/businessManage/diseaseRiskCount'], resolve)
    },
    meta: {
      title: '疾病风险测评统计',
      icon: 'table'
    }
  }
]
