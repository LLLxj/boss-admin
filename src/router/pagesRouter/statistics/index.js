import asqCount from './asqCount'
import measurementCount from './measureCount'
import measurementSearch from './measureSearch'
import policyQuery from './policyQuery'
import premiumCount from './premiumCount'
import Layout from '@/views/layout'

export default [
  {
    path: '/statistics',
    name: 'statistics',
    component: Layout,
    meta: {
      title: '查询统计',
      icon: 'table'
    },
    children: [
      ...measurementCount,
      ...asqCount,
      ...measurementSearch,
      ...premiumCount,
      ...policyQuery
    ]
  }
]
