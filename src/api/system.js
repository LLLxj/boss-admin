import request from '@/utils/request'

const baseUrl = '/apiPro'

class System {
  static getQiniuToken (data) {
    return request({
      url: `${baseUrl}/cms/getQiNiuToken`,
      method: 'post'
    })
  }
}

export default System
