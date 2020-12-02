import request from '@/utils/request'

const baseUrl = '/apiPro'

class Mask {
  static list (data) {
    return request({
      url: `${baseUrl}/mask/activityrecordlist`,
      method: 'post',
      data
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/mask/recommenddetail`,
      method: 'post',
      data
    })
  }

  static sendGoods (data) {
    return request({
      url: `${baseUrl}/mask/sendgoods`,
      method: 'post',
      data
    })
  }

  static logout () {
    return request({
      url: `${baseUrl}/sys/logout`,
      method: 'post'
    })
  }
}

export default Mask
