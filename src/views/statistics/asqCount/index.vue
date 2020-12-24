<template>
  <div class="app-container">
    <div class="countTotal">问卷总计：{{totalCount}}份</div>
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="渠道名称">
        <el-select v-model="searchData.channelCodeMain" clearable filterable placeholder="请选择渠道名称">
          <el-option v-for="item in storeList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
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
      <el-table-column label="渠道" prop="channelNameMain" align="center" header-align="center" min-width="180"/>
      <el-table-column label="问卷数量" prop="count" header-align="center" align="center" min-width="80" />
      <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['pf:qa/statisticsdetail']" type="text" @click.stop="getDetail(scope.row.channelCodeMain)">查看详情</el-button>
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
import AsqCount from '@/api/statistics/asqCount'
import CheckPermission from '@/utils/permissions'

export default {
  name: 'statistics-measurementCount',
  data () {
    return {
      list: [],
      listLoading: true,
      // 搜索条件
      searchData: {
        channelCodeMain: '',
        startSubmitTime: '',
        endSubmitTime: '',
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
      totalNum: 100,
      totalCount: ''
    }
  },
  mounted () {
    if (CheckPermission.hasPermission('pf:channel/list')) {
      this.getChannelList()
    }
    this.getDataList()
  },
  components: {
  },
  methods: {
    getChannelList () {
      this.listLoading = true
      AsqCount.channelList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.storeList = data
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
    getDataListHandle () {
      this.searchData.page.currentPage = 1
      this.currentPage = 1
      this.getDataList()
    },
    getDataList () {
      this.listLoading = true
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.startSubmitTime = postData.rangeTime[0]
        postData.endSubmitTime = postData.rangeTime[1]
      }
      AsqCount.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.list = data.datas
          this.totalNum = data.totalRecord
          this.totalCount = data.totalCount
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
    // 编辑
    getDetail (row) {
      console.log(row)
      this.$router.push({
        name: 'statistics-asqCount-detail',
        query: {
          channelCodeMain: row,
          startSubmitTime: this.searchData.startSubmitTime,
          endSubmitTime: this.searchData.endSubmitTime
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
        channelCodeMain: '',
        startSubmitTime: '',
        endSubmitTime: '',
        rangeTime: [],
        page: {
          pageSize: 10,
          currentPage: 1
        }
      }
      this.getDataList()
    },
    handleSizeChange (row) { // 分页事件
      this.searchData.page.pageSize = row
      this.getDataList()
    },
    handleCurrentChange (row) {
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
.countTotal{
  position: absolute;
  background-color: #ecf5ff;
  width: 150px;
  height: 50px;
  padding: 0 10px;
  line-height: 50px;
  top:14px;
  right: 18px;
  text-align: center;
  border: 1px solid #d9ecff;
  color: #409eff;
}
</style>
