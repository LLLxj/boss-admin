import request from '@/utils/request'

const baseUrl = '/apiPro'

class CmsCategory {
  static info (data) {
    return request({
      url: `${baseUrl}/cms/category/detail`,
      method: 'post',
      data
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/cms/category/add`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/cms/category/update`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/cms/category/delete`,
      method: 'post',
      data
    })
  }
}

export default CmsCategory
