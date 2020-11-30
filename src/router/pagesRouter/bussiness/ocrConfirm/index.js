export default [
  {
    path: 'ocrConfirm',
    name: 'bussiness-ocrConfirm',
    component (resolve) {
      require(['@/views/bussiness/ocrConfirm'], resolve)
    },
    meta: {
      title: 'OCR确认'
    }
  }
]
