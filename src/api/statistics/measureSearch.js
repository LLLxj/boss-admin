import request from '@/utils/request'

const baseUrl = '/apiPro'

class MeasureSearch {
  static list (data) {
    return request({
      url: `${baseUrl}/pf/ev/list`,
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
      url: `${baseUrl}/pf/ev/detail/detail`,
      method: 'post',
      data
    })
  }
}

export default MeasureSearch
