import cmsClassify from './cmsClassify'
import cmsContent from './cmsContent'
import Layout from '@/views/layout'
export default [
  {
    path: '/cms',
    component: Layout,
    name: 'cms',
    meta: {
      title: 'CMS',
      icon: 'table'
    },
    children: [
      ...cmsContent,
      ...cmsClassify
    ]
  }
]
