import request from '@/utils/request'

const baseUrl = '/apiPro'

class Business {
  static list (data) {
    return request({
      url: `${baseUrl}/mer/pagelist`,
      method: 'post',
      data
    })
  }

  static ipList (data) {
    return request({
      url: `${baseUrl}/mer/ip/list`,
      method: 'post',
      data
    })
  }

  static keyList (data) {
    return request({
      url: `${baseUrl}/mer/key/list`,
      method: 'post',
      data
    })
  }

  static serviceList (data) {
    return request({
      url: `${baseUrl}/mer/merservice/pagequery`,
      method: 'post',
      data
    })
  }

  static selectServiceList () {
    return request({
      url: `${baseUrl}/mer/service/config/list`,
      method: 'post'
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/mer/add`,
      method: 'post',
      data
    })
  }

  static saveIp (data) {
    return request({
      url: `${baseUrl}/mer/ip/add`,
      method: 'post',
      data
    })
  }

  static deleteIp (data) {
    return request({
      url: `${baseUrl}/mer/ip/delete`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/mer/detail`,
      method: 'post',
      data
    })
  }

  static updateInfo (data) {
    return request({
      url: `${baseUrl}/mer/update`,
      method: 'post',
      data
    })
  }

  static saveKey (data) {
    return request({
      url: `${baseUrl}/mer/key/add`,
      method: 'post',
      data
    })
  }

  static updateKey (data) {
    return request({
      url: `${baseUrl}/mer/key/update`,
      method: 'post',
      data
    })
  }

  static updateService (data) {
    return request({
      url: `${baseUrl}/mer/merservice/update`,
      method: 'post',
      data
    })
  }

  static saveService (data) {
    return request({
      url: `${baseUrl}/mer/merservice/add`,
      method: 'post',
      data
    })
  }

  static deleteService (data) {
    return request({
      url: `${baseUrl}/mer/merservice/delete`,
      method: 'post',
      data
    })
  }
}

export default Business
