import activities from './activities'
import autodiagnostic from './autodiagnostic'
import bodyCheck from './bodyCheck'
import bookQuestion from './bookQuestion'
import businessManage from './businessManage'
import bussiness from './bussiness'
import cms from './cms'
import healthyClass from './healthyClass'
import memberManage from './memberManage'
import pinecone from './pinecone'
import safe from './safe'
import statistics from './statistics'
import tags from './tags'
import user from './user'

export default [
  ...bussiness, // 业务管理
  ...user, // 用户管理
  ...statistics, // 查询统计
  ...businessManage, // 商户管理
  ...tags, // 打标系统
  ...safe, // 安全云脑
  ...cms, // CMS
  ...pinecone, // 松果衣服后台
  ...autodiagnostic, // 自诊系统
  ...bookQuestion, // 书籍问卷
  ...healthyClass, // 健康星球
  ...memberManage, // 会员服务管理
  ...bodyCheck, // 体检查查
  ...activities // 活动管理
]
