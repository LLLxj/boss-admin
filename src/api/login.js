import request from '@/utils/request'

const baseUrl = '/apiPro'

class System {
  static login (data) {
    return request({
      url: `${baseUrl}/auth/login`,
      // url: `${baseUrl}/login`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/permission/queryall`,
      method: 'post',
      data
    })
  }

  static captcha () {
    return request({
      url: `${baseUrl}/auth/captcha`,
      method: 'post'
    })
  }

  static logout () {
    return request({
      url: `${baseUrl}/auth/logout`,
      method: 'post'
    })
  }
}

export default System
