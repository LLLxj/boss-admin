import request from '@/utils/request'

const baseUrl = '/apiPro'

class PremiumCount {
  static list (data) {
    return request({
      url: `${baseUrl}/pf/premium/statistical`,
      method: 'post',
      data
    })
  }

  static productList (data) {
    return request({
      url: `${baseUrl}/pf/product/list`,
      method: 'post',
      data
    })
  }

  static inventoryDetail (data) {
    return request({
      url: `${baseUrl}/pf/inventory/detail`,
      method: 'post',
      data
    })
  }

  static export (data) {
    return request({
      url: `${baseUrl}/pf/inventory/export`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/pf/premium/detail`,
      method: 'post',
      data
    })
  }
}

export default PremiumCount
