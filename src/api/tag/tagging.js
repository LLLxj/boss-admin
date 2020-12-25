import request from '@/utils/request'

const baseUrl = '/apiPro'

class Tagging {
  static list (data) {
    return request({
      url: `${baseUrl}/prodata/selectprodatarelpage`,
      method: 'post',
      data
    })
  }

  static selectproList () { // 标签管理
    return request({
      url: `${baseUrl}/label/selectprolist`,
      method: 'post'
    })
  }

  static dataCountList (data) { // 批次查询
    return request({
      url: `${baseUrl}/prodata/selectbatchbyproid`,
      method: 'post',
      data
    })
  }

  static receive (data) { // 领取
    return request({
      url: `${baseUrl}/prodata/batchreceive`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/prodata/detail`,
      method: 'post',
      data
    })
  }

  static labelList (data) {
    return request({
      url: `${baseUrl}/prodata/featurelabellist`,
      method: 'post',
      data
    })
  }
}

export default Tagging
