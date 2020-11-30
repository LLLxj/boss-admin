import checkProject from './checkProject'
import hotSearch from './hotSearch'
import inspectionProject from './inspectionProject'
import Layout from '@/views/layout'

export default [
  {
    path: '/bodyCheck',
    name: 'bodyCheck',
    component: Layout,
    meta: {
      title: '体检查查'
    },
    children: [
      ...checkProject,
      ...hotSearch,
      ...inspectionProject
    ]
  }
]
