import request from '@/utils/request'

const baseUrl = '/apiPro'

class Business {
  static unHandle (data) { // ocr待处理列表
    return request({
      url: `${baseUrl}/ev/ocr/unmanagelist`,
      method: 'post',
      data
    })
  }

  static ungetHandle (data) { // ocr待领取
    return request({
      url: `${baseUrl}/ev/ocr/receivelist`,
      method: 'post',
      data
    })
  }

  static hadHandle (data) { // ocr已处理
    return request({
      url: `${baseUrl}/ev/ocr/managelist`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/sys/info/` + data,
      method: 'get'
    })
  }

  static logout () {
    return request({
      url: `${baseUrl}/sys/logout`,
      method: 'post'
    })
  }
}

export default Business
