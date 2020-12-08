import request from '@/utils/request'

const baseUrl = '/apiPro'

class AsqCount {
  static list (data) {
    return request({
      url: `${baseUrl}/pf/qa/statistics`,
      method: 'post',
      data
    })
  }

  static channelList () {
    return request({
      url: `${baseUrl}/pf/channel/list`,
      method: 'post'
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/pf/qa/statisticsdetail`,
      method: 'post',
      data
    })
  }
}

export default AsqCount
