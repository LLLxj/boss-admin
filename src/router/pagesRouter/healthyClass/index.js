import categoryManage from './categoryManage'
import measureManage from './measureManage'
import Layout from '@/views/layout'

export default [
  {
    path: '/healthyClass',
    name: 'healthyClass',
    component: Layout,
    meta: {
      title: '健康星球',
      icon: 'table'
    },
    children: [
      ...categoryManage,
      ...measureManage
    ]
  }
]
