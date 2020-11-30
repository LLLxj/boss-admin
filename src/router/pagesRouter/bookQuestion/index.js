import bookManage from './bookManage'
import categotyManage from './categotyManage'
import Layout from '@/views/layout'

export default [
  {
    path: '/bookQuestion',
    name: 'bookQuestion',
    component: Layout,
    meta: {
      title: '书籍问卷'
    },
    children: [
      ...bookManage,
      ...categotyManage
    ]
  }
]
