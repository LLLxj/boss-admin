import request from '@/utils/request'

const baseUrl = '/apiPro'

class ServiceSet {
  static list (data) {
    return request({
      url: `${baseUrl}/mer/service/config/pagequery`,
      method: 'post',
      data
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/mer/service/config/add`,
      method: 'post',
      data
    })
  }

  static unLine (data) {
    return request({
      url: `${baseUrl}/mer/service/config/changestatus`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/mer/service/config/delete`,
      method: 'post',
      data
    })
  }
}

export default ServiceSet
