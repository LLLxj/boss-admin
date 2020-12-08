<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <div class="row" v-if="searchData.startSubmitTime">时间:{{searchData.startSubmitTime}} — {{searchData.endSubmitTime}}</div>
      <div class="row" v-else>时间:全部</div>
      <el-form :model="dataForm" ref="dataForm" label-width="200px">
        <el-form-item label="商户ID:">
          <el-input v-model="dataForm.appId" readonly></el-input>
        </el-form-item>
        <el-form-item label="商户名称:">
          <el-input v-model="dataForm.merName" readonly></el-input>
        </el-form-item>
        <el-form-item label="总调用:">
          <el-input v-model="dataForm.totalCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="商户调用:">
          <el-input v-model="dataForm.merCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="销售渠道调用:">
          <el-input v-model="dataForm.channelCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="销售渠道调用明细:">
          <el-table :data="dataForm.datas" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
            <el-table-column label="销售渠道" prop="channelName" align="center" header-align="center" min-width="180"/>
            <el-table-column label="产品名称" prop="productName" header-align="center" align="center" min-width="80" />
            <el-table-column label="保险品牌" prop="cpName" header-align="center" align="center" min-width="120" />
            <el-table-column label="调用次数" prop="count" header-align="center" align="center" min-width="120" />
          </el-table>
          <!-- 分页 -->
          <div class="x-pagination" v-if="dataForm.datas && dataForm.datas.length">
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
import MeasureCount from '@/api/statistics/measureCount'
import CheckPermission from '@/utils/permissions'
export default {
  name: 'statistics-measureCount-detail',
  data () {
    return {
      listLoading: false,
      visible: false,
      searchData: {
        merId: '',
        startSubmitTime: '',
        endSubmitTime: '',
        currentPage: 1,
        pageSize: 10
      },
      dataForm: {
        appId: '',
        merName: '',
        totalCount: '',
        merCount: '',
        channelCount: '',
        datas: []
      },
      id: '',
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  created () {
    const merId = this.$route.query.merId
    const startSubmitTime = this.$route.query.startSubmitTime
    const endSubmitTime = this.$route.query.endSubmitTime
    this.searchData.merId = merId
    this.searchData.startSubmitTime = startSubmitTime
    this.searchData.endSubmitTime = endSubmitTime
    if (CheckPermission.hasPermission('pf:statistical/detail') && merId) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      const params = this.searchData
      this.listLoading = true
      MeasureCount.info(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
          this.totalNum = data.totalRecord
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
