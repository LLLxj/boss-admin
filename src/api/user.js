import request from '@/utils/request'

const baseUrl = '/apiPro'

class User {
  static list (data) {
    return request({
      url: `${baseUrl}/user/list`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/user/queryall`,
      method: 'post',
      data
    })
  }

  static resetPas (data) {
    return request({
      url: `${baseUrl}/user/resetpwd`,
      method: 'post',
      data
    })
  }

  static userRoleList (data) { // 用户角色列表
    return request({
      url: `${baseUrl}/role/user/list`,
      method: 'post',
      data
    })
  }

  static roleListAll (data) { // 用户角色列表所有
    return request({
      url: `${baseUrl}/role/list`,
      method: 'post',
      data
    })
  }

  static disable (data) { // 禁用
    return request({
      url: `${baseUrl}/user/delete`,
      method: 'post',
      data
    })
  }

  static normal (data) { // 启用
    return request({
      url: `${baseUrl}/user/restore`,
      method: 'post',
      data
    })
  }

  static logout () {
    return request({
      url: `${baseUrl}/auth/logout`,
      method: 'post'
    })
  }
}

export default User
