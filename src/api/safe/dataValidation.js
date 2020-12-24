import request from '@/utils/request'

const baseUrl = '/apiPro'

class Safe {
  static list (data) {
    return request({
      url: `${baseUrl}/securitybrain/score/page`,
      method: 'post',
      data
    })
  }

  static operateList () {
    return request({
      url: `${baseUrl}/securitybrain/score/members`,
      method: 'post'
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/securitybrain/score/detail`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/securitybrain/score/submit`,
      method: 'post',
      data
    })
  }

  static getReceiveNum (data) {
    return request({
      url: `${baseUrl}/securitybrain/score/unreceivecount`,
      method: 'post',
      data
    })
  }

  static putReceive (data) {
    return request({
      url: `${baseUrl}/securitybrain/score/receive`,
      method: 'post',
      data
    })
  }
}

export default Safe
