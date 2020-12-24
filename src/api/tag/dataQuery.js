import request from '@/utils/request'

const baseUrl = '/apiPro'

class DataQuery {
  static list (data) {
    return request({
      url: `${baseUrl}/prodata/selectdatapage`,
      method: 'post',
      data
    })
  }

  static getDiseaseList (data) {
    return request({
      url: `${baseUrl}/pro/selectdiseaselist`,
      method: 'post',
      data
    })
  }

  static getDataCountList (data) {
    return request({
      url: `${baseUrl}/prodata/selectbatch`,
      method: 'post',
      data
    })
  }
}

export default DataQuery
