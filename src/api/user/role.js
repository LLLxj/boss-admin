import request from '@/utils/request'

const baseUrl = '/apiPro'

class Roles {
  static list (data) {
    return request({
      url: `${baseUrl}/role/pagelist`,
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

  static permissionList () {
    return request({
      url: `${baseUrl}/permission/list`,
      method: 'post'
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/permission/setpermission`,
      method: 'post',
      data
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/role/save`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/role/delete`,
      method: 'post',
      data
    })
  }

  static relation (data) {
    return request({
      url: `${baseUrl}/role/relation`,
      method: 'post',
      data
    })
  }
}

export default Roles
