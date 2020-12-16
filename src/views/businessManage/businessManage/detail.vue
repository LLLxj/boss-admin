<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in orderStatusFormat" :key="item.value" :name="item.label" :label="item.label" />
    </el-tabs>
    <el-row :span="24">
      <el-col :span="20">
        <div v-if="activeName === '基本信息'">
          <BusinessInfo ref="BusinessInfo" />
        </div>
        <div v-if="activeName === '商户ip'" class="list-style">
          <DeleteBusinessIp ref="DeleteBusinessIp" />
        </div>
        <div v-if="activeName === '密钥'" class="list-style">
          <PasswordKey ref="PasswordKey" />
        </div>
        <div v-if="activeName === '服务'" class="list-style">
          <Service ref="Service" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Permissions from '@/utils/permissions'
import DeleteBusinessIp from '@/components/BusinessManage/BusinessIp'
import BusinessInfo from '@/components/BusinessManage/BusinessInfo'
import PasswordKey from '@/components/BusinessManage/PasswordKey'
import Service from '@/components/BusinessManage/Service'

export default {
  name: 'businessManage-businessManagement-detail',
  data () {
    return {
      id: '',
      activeName: '',
      listLoading: false,
      orderStatusFormat: [
        { label: '基本信息', value: 1, permission: 'mer:detail' },
        { label: '商户ip', value: 2, permission: 'mer:ip/list' },
        { label: '密钥', value: 3, permission: 'mer:key/list' },
        { label: '服务', value: 4, permission: 'mer:merservice/pagequery' }
        // { label: '服务', value: 4, permission: 'mer:service/config/list' }
      ],
      statusList: [
        { label: '正常', value: 1 },
        { label: '失效', value: 2 }
      ],
      ipList: []
    }
  },
  components: {
    DeleteBusinessIp, BusinessInfo, PasswordKey, Service
  },
  created () {
    const id = this.$route.query.id
    this.id = id
    this.getDataListHandle()
  },
  methods: {
    handleTabClick (item) {
      this.activeName = item.name
      this.toSearch()
    },
    getDataListHandle () {
      this.orderStatusFormat = Permissions.checkPermissionList(this.orderStatusFormat)
      this.activeName = this.orderStatusFormat[0].label
      this.toSearch()
    },
    toSearch () {
      if (this.activeName === '基本信息') {
        this.getBasicInfo()
      } else if (this.activeName === '商户ip') {
        this.getBusinessIp()
      } else if (this.activeName === '密钥') {
        this.getPasKey()
      } else if (this.activeName === '服务') {
        this.getService()
      }
    },
    getBasicInfo () { // 基本信息
      this.$nextTick(() => {
        this.$refs.BusinessInfo.init(this.id)
      })
    },
    getBusinessIp () { // 商户IP
      this.$nextTick(() => {
        this.$refs.DeleteBusinessIp.init(this.id)
      })
    },
    getPasKey () { // 密钥
      this.$nextTick(() => {
        this.$refs.PasswordKey.init(this.id)
      })
    },
    getService () { // 服务
      this.$nextTick(() => {
        this.$refs.Service.init(this.id)
      })
    }
  }
}
</script>

<style>

</style>
