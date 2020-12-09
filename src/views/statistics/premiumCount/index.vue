<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="自定义时间">
        <el-date-picker
          v-model="searchData.rangeTime"
          :picker-options="pickerOptions"
          type="daterange" value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
      <el-table-column label="商户名称" prop="merName" header-align="center" align="center" min-width="120" />
      <el-table-column label="保费" prop="premium" align="center" header-align="center" min-width="80"/>
      <el-table-column label="退保保费" prop="refundPremium" header-align="center" align="center" min-width="80" />
      <el-table-column label="结算保费" prop="settlePremium" header-align="center" align="center" min-width="80" />
      <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['pf:premium/detail']" type="text" @click.stop="getDetail(scope.row.merId)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="x-pagination" v-if="list && list.length">
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
</template>

<script>
import PremiumCount from '@/api/statistics/premiumCount'
export default {
  name: 'statistics-premiumCount',
  data () {
    return {
      list: [],
      listLoading: false,
      // 搜索条件
      searchData: {
        beginStatisticalTime: '',
        endStatisticalTime: '',
        rangeTime: [],
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      storeList: [],
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  mounted () {
    this.getDataList()
  },
  components: {
  },
  methods: {
    getDataListHandle () {
      this.searchData.page.currentPage = 1
      this.currentPage = 1
      this.getDataList()
    },
    getDataList () {
      this.listLoading = true
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.beginStatisticalTime = postData.rangeTime[0]
        postData.endStatisticalTime = postData.rangeTime[1]
      }
      PremiumCount.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.list = data.datas
          this.totalNum = data.totalRecord
        } else {
          this.listLoading = false
          this.$message({
            message: desc,
            type: 'error',
            duration: 1500
          })
        }
      }).catch(err => {
        this.listLoading = false
        console.log(err)
        this.$message({
          message: err || '读取接口失败！',
          type: 'error',
          duration: 1500
        })
      })
    },
    getDetail (row) {
      this.$router.push({
        name: 'statistics-premiumCount-detail',
        query: {
          merId: row,
          beginStatisticalTime: this.searchData.beginStatisticalTime,
          endStatisticalTime: this.searchData.endStatisticalTime
        }
      })
    },
    resetPas (id) {
      this.resetPasVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPas.init(id)
      })
    },
    // 置空搜索
    resetSearch () {
      this.searchData = {
        beginStatisticalTime: '',
        endStatisticalTime: '',
        rangeTime: [],
        page: {
          pageSize: 10,
          currentPage: 1
        }
      }
      this.getDataList()
    },
    // 分页事件
    handleSizeChange (row) {
    // 每页显示数改变
      this.searchData.page.pageSize = row
      this.getDataList()
    },
    handleCurrentChange (row) {
    // 当前页改变
      this.searchData.page.currentPage = row
      this.$nextTick(function () {
        this.currentPage = row
      })
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/common.scss";
.com_logo{
  width:50px;
  height:50px;
}
.overLength{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.button-grounp{
  margin: 10px 0 20px 0;
}
</style>
