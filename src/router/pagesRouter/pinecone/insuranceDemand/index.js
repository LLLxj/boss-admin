export default [
  {
    path: 'insuranceDemand',
    name: 'pinecone-insuranceDemand',
    component (resolve) {
      require(['@/views/pinecone/insuranceDemand'], resolve)
    },
    meta: {
      title: '保险需求'
    }
  }
]
