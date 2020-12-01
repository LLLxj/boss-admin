import mask from './mask'
import Layout from '@/views/layout'

export default [
  {
    path: '/activities',
    name: 'activities',
    redirect: '/activities/mask',
    component: Layout,
    meta: {
      title: '活动管理',
      icon: 'table'
    },
    children: [
      ...mask
    ]
  }
]
