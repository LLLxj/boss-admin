<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <div class="row" v-if="searchData.startSubmitTime">时间:{{searchData.startSubmitTime}} — {{searchData.endSubmitTime}}</div>
      <div class="row" v-else>时间:全部</div>
      <el-form :model="dataForm" ref="dataForm" label-width="200px">
        <el-form-item label="渠道:">
          <el-input v-model="dataForm.channelNameMain" readonly></el-input>
        </el-form-item>
        <el-form-item label="一级渠道问卷数量:">
          <el-input v-model="dataForm.channelMainCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="二级渠道问卷数量:">
          <el-input v-model="dataForm.channelSecCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="二级渠道问卷明细:">
          <el-table :data="dataForm.datas" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
            <el-table-column label="二级渠道" prop="channelNameSec" align="center" header-align="center" min-width="180"/>
            <el-table-column label="问卷数量" prop="count" header-align="center" align="center" min-width="80" />
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
import Asqcount from '@/api/statistics/asqCount'
import CheckPermission from '@/utils/permissions'
export default {
  name: 'statistics-measureSearch-detail',
  data () {
    return {
      listLoading: false,
      visible: false,
      searchData: {
        channelCodeMain: '',
        startSubmitTime: '',
        endSubmitTime: '',
        currentPage: 1,
        pageSize: 10
      },
      dataForm: {
        channelNameMain: '',
        channelMainCount: '',
        channelSecCount: '',
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
    const channelCodeMain = this.$route.query.channelCodeMain
    const startSubmitTime = this.$route.query.startSubmitTime
    const endSubmitTime = this.$route.query.endSubmitTime
    this.searchData.channelCodeMain = channelCodeMain
    this.searchData.startSubmitTime = startSubmitTime
    this.searchData.endSubmitTime = endSubmitTime
    if (CheckPermission.hasPermission('pf:qa/statisticsdetail') && channelCodeMain) {
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      const params = this.searchData
      this.listLoading = true
      Asqcount.info(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          this.dataForm = data
          this.dataForm.datas = data.page.datas
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
