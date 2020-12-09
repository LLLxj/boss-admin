<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <el-form :model="dataForm" ref="dataForm" label-width="100px">
        <el-form-item label="商户名称:">
          <span v-text="dataForm.merName"></span>
        </el-form-item>
        <el-form-item v-if="searchData.beginStatisticalTime !== '' && searchData.endStatisticalTime !== ''" label="时间:">
          <span>{{searchData.beginStatisticalTime}} — {{searchData.endStatisticalTime}}</span>
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="dataForm.benefitCode" @change="getBenefitCode" clearable filterable placeholder="请选择产品名称">
            <el-option v-for="item in productList" :key="item.benefitCode" :label="item.productName" :value="item.benefitCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-table :data="dataForm.list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
            <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
            <el-table-column label="产品名称" prop="productName" align="center" header-align="center" min-width="180"/>
            <el-table-column label="保费" prop="premium" header-align="center" align="center" min-width="120" />
            <el-table-column label="退保保费" prop="refundPremium" header-align="center" align="center" min-width="120" />
            <el-table-column label="结算保费" prop="settlePremium" header-align="center" align="center" min-width="120" />
            <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-permission="['pf:inventory/detail']" type="text" @click.stop="getDetail(scope.row.benefitCode)">查看清单</el-button>
              </template>
            </el-table-column>
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
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import PremiumCount from '@/api/statistics/premiumCount'
import CheckPermission from '@/utils/permissions'
export default {
  name: 'statistics-premiumCount-detail',
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
    const beginStatisticalTime = this.$route.query.beginStatisticalTime
    const endStatisticalTime = this.$route.query.endStatisticalTime
    this.searchData.merId = merId
    this.searchData.startSubmitTime = beginStatisticalTime
    this.searchData.endSubmitTime = endStatisticalTime
    if (CheckPermission.hasPermission('pf:product/list')) {
      this.getProductList()
    }
    if (CheckPermission.hasPermission('pf:premium/detail')) {
      this.getInfo()
    }
  },
  methods: {
    getProductList () {
      const params = {
        merId: this.searchData.merId,
        beginStatisticalTime: this.searchData.beginStatisticalTime,
        endStatisticalTime: this.searchData.endStatisticalTime
      }
      this.listLoading = true
      PremiumCount.productList(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          this.productList = []
          const obj = [{
            benefitCode: '',
            productName: '全部'
          }]
          this.productList = obj.concat(data)
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        this.$message.error(err)
      })
    },
    getInfo () {
      const params = this.searchData
      this.listLoading = true
      PremiumCount.info(params).then(res => {
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
    getBenefitCode (item) {
      console.log('获取benefitCode')
      console.log(item)
      this.searchData.benefitCode = item
      this.getInfo()
    },
    getDetail (row) {
      this.$router.push({
        name: 'statistics-premiumList-list',
        query: {
          merId: this.searchData.merId,
          benefitCode: row,
          beginStatisticalTime: this.searchData.beginStatisticalTime,
          endStatisticalTime: this.searchData.endStatisticalTime
        }
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
