<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <el-form :model="dataForm" ref="dataForm" label-width="120px">
        <el-form-item v-if="searchData.beginStatisticalTime !== '' && searchData.endStatisticalTime !== ''" label="时间:">
          <span>{{searchData.beginStatisticalTime}} — {{searchData.endStatisticalTime}}</span>
        </el-form-item>
        <el-form-item label="商户名称:">
          <span v-text="dataForm.merName"></span>
        </el-form-item>
        <el-form-item label="产品名称:">
          <span v-text="dataForm.productName"></span>
        </el-form-item>
        <el-form-item label="保费合计:">
          <span v-text="dataForm.totalPremium"></span>
        </el-form-item>
        <el-form-item label="退保保费合计:">
          <span v-text="dataForm.totaRefundPremium"></span>
        </el-form-item>
        <el-form-item label="结算保费:">
          <span v-text="dataForm.totaSettlePremium"></span>
        </el-form-item>
      </el-form>
      <div style="text-align:right;padding: 30px 0 40px 0;">
        <el-button v-permission="['pf:inventory/export']" type="primary" @click="exportHandle()">导出</el-button>
      </div>
      <div style="margin: 0 30px;">
        <el-table :data="dataForm.list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
          <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
          <el-table-column label="商户订单号" prop="bzId" align="center" header-align="center" min-width="250"/>
          <el-table-column label="保单号" prop="insuranceNo" header-align="center" align="center" min-width="200" />
          <el-table-column label="保费" prop="premium" header-align="center" align="center" min-width="120" />
          <el-table-column label="退保保费" prop="refundPremium" header-align="center" align="center" min-width="120" />
          <el-table-column label="保单生成时间" prop="insuranceTimeDesc" header-align="center" align="center" min-width="200" />
          <el-table-column label="退保时间" prop="cancelTimeDesc" header-align="center" align="center" min-width="200" />
        </el-table>
        <!-- 分页 -->
        <div class="x-pagination" v-if="dataForm.list && dataForm.list.length">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import FileDown from 'file-saver'
import PremiumCount from '@/api/statistics/premiumCount'
import CheckPermission from '@/utils/permissions'
export default {
  name: 'statistics-premiumCount-list',
  data () {
    return {
      listLoading: false,
      visible: false,
      productList: [],
      searchData: {
        merId: '',
        benefitCode: '',
        beginStatisticalTime: '',
        endStatisticalTime: '',
        page: {
          currentPage: 1,
          pageSize: 10
        }
      },
      dataForm: {
        merName: '',
        benefitCode: '',
        list: []
      },
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  created () {
    const merId = this.$route.query.merId
    const benefitCode = this.$route.query.benefitCode
    const beginStatisticalTime = this.$route.query.beginStatisticalTime
    const endStatisticalTime = this.$route.query.endStatisticalTime
    this.searchData.merId = merId
    this.searchData.benefitCode = benefitCode
    this.searchData.startSubmitTime = beginStatisticalTime
    this.searchData.endSubmitTime = endStatisticalTime
    if (CheckPermission.hasPermission('pf:premium/detail')) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      const params = this.searchData
      this.listLoading = true
      PremiumCount.inventoryDetail(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
          this.dataForm.list = data.page.datas
          this.totalNum = data.page.totalRecord
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
    },
    exportHandle () {
      console.log(111)
      const params = this.searchData
      PremiumCount.export(params).then(res => {
        const blob = new Blob([res.data], { type: 'application/ms-excel' })
        const fileName = '清单详情'
        FileDown.saveAs(blob, fileName + '.xls')
      }).catch(err => {
        this.listLoading = false
        this.$message.error(err)
      })
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
