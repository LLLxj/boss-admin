import request from '@/utils/request'

const baseUrl = '/apiPro'

class Receive {
  static list (data) {
    return request({
      url: `${baseUrl}/prodata/selectdata/page`,
      method: 'post',
      data
    })
  }
}

export default Receive
