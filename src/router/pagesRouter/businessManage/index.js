import businessManageList from './businessManageList'
import diseaseRiskCount from './diseaseRiskCount'
import serviceSet from './serviceSet'
import Layout from '@/views/layout'

export default [
  {
    path: '/businessManage',
    name: 'businessManage',
    component: Layout,
    meta: {
      title: '商户管理',
      icon: 'table'
    },
    children: [
      ...businessManageList,
      ...diseaseRiskCount,
      ...serviceSet
    ]
  }
]
