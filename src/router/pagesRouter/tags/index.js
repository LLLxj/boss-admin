import dataQuery from './dataQuery'
import projectManagement from './projectManagement'
import tagging from './tagging'
import tagManagement from './tagManagement'
import Layout from '@/views/layout'

export default [
  {
    path: '/tags',
    name: 'tags',
    component: Layout,
    meta: {
      title: '打标系统'
    },
    children: [
      ...dataQuery,
      ...projectManagement,
      ...tagging,
      ...tagManagement
    ]
  }
]
