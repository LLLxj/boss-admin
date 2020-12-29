import request from '@/utils/request'

const baseUrl = '/apiPro'

class CmsContent {
  static categoryList (data) {
    return request({
      url: `${baseUrl}/cms/category/list`,
      method: 'post',
      data
    })
  }

  static list (data) {
    return request({
      url: `${baseUrl}/cms/content/list`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/cms/content/detail`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/cms/content/delete`,
      method: 'post',
      data
    })
  }

  static publish (data) {
    return request({
      url: `${baseUrl}/cms/content/publish`,
      method: 'post',
      data
    })
  }

  static check (data) {
    return request({
      url: `${baseUrl}/cms/content/audit`,
      method: 'post',
      data
    })
  }

  static unline (data) {
    return request({
      url: `${baseUrl}/cms/content/remove`,
      method: 'post',
      data
    })
  }
}

export default CmsContent
