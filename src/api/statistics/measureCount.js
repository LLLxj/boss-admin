import request from '@/utils/request'

const baseUrl = '/apiPro'

class MeasureCount {
  static list (data) {
    return request({
      url: `${baseUrl}/pf/ev/statistical`,
      method: 'post',
      data
    })
  }

  static storeList () {
    return request({
      url: `${baseUrl}/pf/list`,
      method: 'post'
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/pf/statistical/detail`,
      method: 'post',
      data
    })
  }
}

export default MeasureCount
