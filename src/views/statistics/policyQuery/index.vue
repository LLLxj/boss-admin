<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form :model="searchData" :inline="true" ref="searchData" label-width="80px">
          <el-form-item label="保单号:">
            <el-input v-model="searchData.insuranceNo" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="searchData.insuranceNo === ''" v-permission="['pf:insurance/detail']" type="primary" @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <div style="padding: 0 30px" v-if="dataForm === null">暂无数据</div>
      <div v-if="dataForm && dataForm.insuranceNo !== ''">
        <el-form :model="dataForm" :inline="true" ref="dataForm" label-width="150px">
          <el-col :span="8">
            <el-form-item label="保单号:">
              <span v-text="dataForm.insuranceNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商户订单号:">
              <span v-text="dataForm.bzId"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测评编号:">
              <span v-text="dataForm.serialNumber"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类型编码:">
              <span v-text="dataForm.benefitCode"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称:">
              <span v-text="dataForm.productName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保险公司编码:">
              <span v-text="dataForm.cpCode"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保险公司名称:">
              <span v-text="dataForm.cpName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保费:">
              <span v-text="dataForm.premium"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保单状态:">
              <span v-text="dataForm.insuranceStatus"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名:">
              <span v-text="dataForm.cname"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证件号码:">
              <span v-text="dataForm.idNumber"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保单生成时间:">
              <span v-text="dataForm.insuranceTimeDesc"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否退保:">
              <span v-if="dataForm.isCancel === 1">是</span>
              <span v-else>否</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退保时间:">
              <span v-text="dataForm.cancelTtimeDesc"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退保保费:">
              <span v-text="dataForm.refundPremium"></span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </el-row>
  </div>
</template>

<script>
import PolicyQuery from '@/api/statistics/policyQuery'
// import CheckPermission from '@/utils/permissions'
export default {
  name: 'statistics-policyQuery',
  data () {
    return {
      searchData: {
        insuranceNo: ''
      },
      dataForm: {
        insuranceNo: '',
        bzId: '',
        serialNumber: '',
        benefitCode: '',
        productName: '',
        cpCode: '',
        cpName: '',
        premium: '',
        insuranceStatus: '',
        cname: '',
        idNumber: '',
        insuranceTimeDesc: '',
        isCancel: '',
        cancelTtimeDesc: '',
        refundPremium: ''
      }
    }
  },
  methods: {
    getDataList () {
      const params = this.searchData
      this.listLoading = true
      PolicyQuery.info(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        this.$message.error(err)
      })
    },
    // 分页事件
    handleSizeChange (row) {
    // 每页显示数改变
      this.searchData.pageSize = row
      this.getInfo()
    },
    handleCurrentChange (row) {
    // 当前页改变
      this.searchData.currentPage = row
      this.$nextTick(function () {
        this.currentPage = row
      })
      this.getInfo()
    }
  }

}
</script>

<style lang="scss" scoped>
  .row{
    text-align:right;
    color: #aaa;
    font-size: 18px;
    padding: 20px 0;
  }
</style>
