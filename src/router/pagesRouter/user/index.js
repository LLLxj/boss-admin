import permission from './permission'
import role from './role'
import user from './user'
import Layout from '@/views/layout'

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    meta: {
      title: '用户管理',
      icon: 'table'
    },
    children: [
      ...user,
      ...role,
      ...permission
    ]
  }
]
