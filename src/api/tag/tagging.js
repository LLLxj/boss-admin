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
}

export default Tagging
