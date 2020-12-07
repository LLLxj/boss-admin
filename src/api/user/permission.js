import request from '@/utils/request'

const baseUrl = '/apiPro'

class Permissions {
  static list (data) {
    return request({
      url: `${baseUrl}/permission/list`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/role/getAuthorizationData`,
      method: 'post',
      data
    })
  }

  static getInfo (data) {
    return request({
      url: `${baseUrl}/permission/selectbyid`,
      method: 'post',
      data
    })
  }

  static permissionList () {
    return request({
      url: `${baseUrl}/permission/list`,
      method: 'post'
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/permission/update`,
      method: 'post',
      data
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/permission/save`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/permission/delete`,
      method: 'post',
      data
    })
  }
}

export default Permissions
