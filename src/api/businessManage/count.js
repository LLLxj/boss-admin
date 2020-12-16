import request from '@/utils/request'

const baseUrl = '/apiPro'

class Count {
  static basicInfo (data) {
    return request({
      url: `${baseUrl}/merstatistics/baseinfo`,
      method: 'post',
      data
    })
  }

  static weekInfo (data) {
    return request({
      url: `${baseUrl}/merstatistics/weekinfo`,
      method: 'post',
      data
    })
  }

  static monthInfo (data) {
    return request({
      url: `${baseUrl}/merstatistics/monthinfo`,
      method: 'post',
      data
    })
  }
}

export default Count
