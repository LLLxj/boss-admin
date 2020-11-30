import autognosisPM from './autognosisPM'
import insuranceDemand from './insuranceDemand'
import Layout from '@/views/layout'

export default [
  {
    path: '/autodiagnostic',
    name: 'autodiagnostic',
    component: Layout,
    meta: {
      title: '自诊系统'
    },
    children: [
      ...autognosisPM,
      ...insuranceDemand
    ]
  }
]
