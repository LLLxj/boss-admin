import evaluationQuery from './evaluationQuery'
import manualEvaluation from './manualEvaluation'
import ocrConfirm from './ocrConfirm'
import Layout from '@/views/layout'
export default [
  {
    path: '/bussiness',
    component: Layout,
    redirect: 'noredirect', // 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
    name: 'bussiness',
    meta: {
      title: '业务管理'
    },
    children: [
      ...evaluationQuery, // 测评管理
      ...manualEvaluation, // 人工测评
      ...ocrConfirm // OCR确认
    ]
  }
]
