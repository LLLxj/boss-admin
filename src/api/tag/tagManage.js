import request from '@/utils/request'

const baseUrl = '/apiPro'

class TagManage {
  static list (data) {
    return request({
      url: `${baseUrl}/label/selectlabellist`,
      method: 'post',
      data
    })
  }

  static labelList () {
    return request({
      url: `${baseUrl}/label/selectprolist`,
      method: 'post'
    })
  }

  static getFeature (data) {
    return request({
      url: `${baseUrl}/label/selectfeaturelist`,
      method: 'post',
      data
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/label/add`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/label/delete`,
      method: 'post',
      data
    })
  }
}

export default TagManage
