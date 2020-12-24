<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="提交时间:">
        <el-date-picker v-model="searchData.rangeTime" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="打分状态:">
        <el-select v-model="searchData.status" clearable filterable placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作人:">
        <el-select v-model="searchData.operatorId" clearable filterable placeholder="请选择">
          <el-option v-for="item in operateList" :key="item.operatorId" :label="item.operator" :value="item.operatorId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
        <el-button type="primary" v-permission="['securitybrain:score/receive']" @click="toReveiveHandle()">领取</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="测评编号" prop="serialNumber" align="center" header-align="center" min-width="80"/>
      <el-table-column label="提交时间" prop="submitTimeDesc" header-align="center" align="center" min-width="80" />
      <el-table-column label="打分状态" prop="status" header-align="center" align="center" min-width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 3">已打分</el-tag>
          <el-tag v-else type="info">未打分</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator" header-align="center" align="center" min-width="80" />
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button v-permission="['securitybrain:score/detail']" v-if="scope.row.status == 2" type="text" @click="handleEdit(scope.row)">处理</el-button>
          <el-button v-permission="['securitybrain:score/detail']" v-if="scope.row.status == 3" type="text" @click="handleEdit(scope.row)">查看</el-button>
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
    <ReceivePop v-if="receivePopVisible" ref="ReceivePop" @get-data-list="getDataListHandle" />
  </div>
</template>

<script>
import Safe from '@/api/safe/dataValidation'
import CheckPermission from '@/utils/permissions'
import ReceivePop from './receivePop'

export default {
  name: 'safe-dataValidation',
  data () {
    return {
      list: [],
      listLoading: true,
      // 搜索条件
      searchData: {
        operatorId: '',
        status: '',
        rangeTime: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      operateList: [],
      statusList: [
        { label: '全部', value: '' },
        { label: '未打分', value: 2 },
        { label: '已打分', value: 3 }
      ],
      receivePopVisible: false,
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  created () {
    this.getDataListHandle()
    if (CheckPermission.hasPermission('securitybrain:score/members')) {
      this.getOperateList()
    }
  },
  components: {
    ReceivePop
  },
  methods: {
    getDataListHandle () {
      this.searchData.page.currentPage = 1
      this.getDataList()
    },
    getDataList () { // 待领取
      this.listLoading = true
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.startDate = postData.rangeTime[0]
        postData.endDate = postData.rangeTime[1]
      }
      Safe.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.list = data.page.datas
          this.totalNum = data.page.totalRecord
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
    getOperateList () {
      Safe.operateList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.operateList = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit (row) { // 处理操作
      this.$router.push({
        path: 'dataScore',
        query: {
          id: row.id,
          type: row.status
        }
      })
    },
    toReveiveHandle () {
      this.receivePopVisible = true
      this.$nextTick(() => {
        this.$refs.ReceivePop.init()
      })
    },
    // 置空搜索
    resetSearch () {
      this.searchData = {
        operatorId: '',
        status: '',
        rangeTime: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      }
      this.getDataList()
    },
    handleSizeChange (row) {
      this.searchData.page.pageSize = row
      this.getDataList()
    },
    handleCurrentChange (row) {
      this.searchData.page.currentPage = row
      this.$nextTick(function () {
        this.currentPage = row
        this.getDataList()
      })
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
