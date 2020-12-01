import audioClassify from './audioClassify'
import audioList from './audioList'
import channelService from './channelService'
import serviceManage from './serviceManage'
import memberSet from './memberSet'
import videoClassify from './videoClassify'
import videoList from './videoList'
import Layout from '@/views/layout'

export default [
  {
    path: '/memberBusinessManage',
    name: 'member-businessManage',
    component: Layout,
    meta: {
      title: '会员服务管理',
      icon: 'table'
    },
    children: [
      ...audioClassify,
      ...audioList,
      ...channelService,
      ...serviceManage,
      ...memberSet,
      ...videoClassify,
      ...videoList
    ]
  }
]
