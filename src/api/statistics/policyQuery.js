import request from '@/utils/request'

const baseUrl = '/apiPro'

class PolicyQuery {
  static info (data) {
    return request({
      url: `${baseUrl}/pf/insurance/detail`,
      method: 'post',
      data
    })
  }
}

export default PolicyQuery
