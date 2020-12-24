export default [
  {
    path: 'ocrConfirm',
    name: 'bussiness-ocrConfirm',
    component: () => import('@/views/bussiness/ocrConfirm'),
    meta: {
      title: 'OCR确认',
      icon: 'table',
      roles: [
        'ev:ocrlist'
      ]
    }
  }
]
