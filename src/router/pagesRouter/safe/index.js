import dataValidation from './dataValidation'
import Layout from '@/views/layout'

export default [
  {
    path: '/safe',
    name: 'safe',
    component: Layout,
    meta: {
      title: '安全云脑'
    },
    children: [
      ...dataValidation
    ]
  }
]
