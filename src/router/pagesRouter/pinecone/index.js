import contentManage from './contentManage'
import insuranceDemand from './insuranceDemand'
import Layout from '@/views/layout'

export default [
  {
    path: '/pinecone',
    name: 'pinecone',
    component: Layout,
    meta: {
      title: '松果医服后台'
    },
    children: [
      ...contentManage,
      ...insuranceDemand
    ]
  }
]
