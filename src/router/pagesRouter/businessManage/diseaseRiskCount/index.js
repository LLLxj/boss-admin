export default [
  {
    path: 'diseaseRiskCount',
    name: 'businessManage-diseaseRiskCount',
    component: () => import('@/views/businessManage/diseaseRiskCount/index'),
    meta: {
      title: '疾病风险测评统计',
      icon: 'table',
      roles: [
        'disease:risk:count'
      ]
    }
  }
]
