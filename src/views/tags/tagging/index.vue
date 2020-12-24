<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in orderStatusFormat" :key="item.value" :name="item.label" :label="item.label" />
    </el-tabs>
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="打标项目:">
        <el-select v-model="searchData.proId" clearable filterable placeholder="请选择打标项目">
          <el-option v-for="item in proList" :key="item.id" :label="item.proName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据批次:">
        <el-select v-model="searchData.batch" clearable filterable placeholder="请选择数据批次">
          <el-option v-for="item in dataCountList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-button-group class="button-grounp">
      <el-button v-permission="['ev:ocr/receivelist']" size="medium" type="primary" icon="el-icon-edit" @click="ungetHandle()">待领取</el-button>
      <el-button v-permission="['ev:ocr/unmanagelist']" size="medium" type="primary" icon="el-icon-share" @click="unHandle()">待处理</el-button>
      <el-button v-permission="['ev:ocr/managelist']" size="medium" type="primary" icon="el-icon-delete" @click="hadHandle()">已处理</el-button>
      <el-button v-permission="['ev:ocr/batchreceive']" size="medium" type="primary" icon="el-icon-delete" @click="batchHandle()">批量领取</el-button>
    </el-button-group> -->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="打标项目" prop="proName" align="center" header-align="center" min-width="80"/>
      <el-table-column label="数据批次" prop="batch" header-align="center" align="center" min-width="80" />
      <el-table-column v-if="searchData.status == 0" prop="createTimeStr" label="提交时间" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column v-if="searchData.status == 0" prop="count" label="数据总量" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column v-if="searchData.status == 0" prop="unReceiveCount" label="待领取数据量" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column v-if="searchData.status == 1" prop="receiveTimeStr" label="领取时间" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column v-if="searchData.status == 1" prop="receiveCount" label="总领取量" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column v-if="searchData.status == 1" prop="unHandleCount" label="待处理量" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column v-if="searchData.status == 1" prop="unAuditCount" label="待提交审核量" header-align="center" align="center" min-width="80"></el-table-column>
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <!-- <span class="tableBtn" v-if="scope.row.unReceiveCount > 0"  @click="toReceive1(scope.row.id,scope.row.unReceiveCount)">领取</span>
          <span class="tableBtn" v-if="scope.row.unHandleCount > 0 || scope.row.unAuditCount > 0" @click="toDeal(scope.row.proId,scope.row.batch)">处理</span> -->
          <el-button v-permission="['prodata:batchreceive']" v-if="scope.row.unReceiveCount > 0" type="text" @click="receiveHandle(scope.row.id)">领取</el-button>
          <el-button disabled v-if="scope.row.unReceiveCount < 0 || scope.row.unReceiveCount == 0" type="text">已领完</el-button>
          <el-button v-if="scope.row.unHandleCount > 0 || scope.row.unAuditCount > 0" type="text" @click="toReceiveList(scope.row)">处理</el-button>
          <el-button v-if="(scope.row.unHandleCount < 0 || scope.row.unHandleCount === 0) && scope.row.unAuditCount === 0" type="text">处理完毕</el-button>
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
    <ReceiveComponent ref="ReceiveComponent" v-if="receiveVisible" @get-data-list="getDataList" />
  </div>
</template>

<script>
import Tagging from '@/api/tag/tagging'
import CheckPermission from '@/utils/permissions'
import ReceiveComponent from './receivePop'

export default {
  name: 'tags-tagging',
  data () {
    return {
      list: [],
      listLoading: true,
      proList: [],
      dataCountList: [],
      activeName: '待领取',
      // 搜索条件
      searchData: {
        proId: '',
        status: 0,
        batch: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      orderStatusFormat: [
        { label: '待领取', value: 1 },
        { label: '已领取', value: 2 }
      ],
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      receiveVisible: false
    }
  },
  mounted () {
    this.getDataListHandle()
    if (CheckPermission.hasPermission('label:selectprolist')) {
      this.getTagList()
    }
  },
  components: {
    ReceiveComponent
  },
  methods: {
    getDataListHandle () {
      this.searchData.page.currentPage = 1
      this.getDataList()
    },
    getDataList () {
      this.listLoading = true
      const postData = this.searchData
      Tagging.list(postData).then(res => {
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
    getTagList () {
      Tagging.selectproList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.proList = data
        } else {
          this.$message({
            message: desc,
            type: 'error',
            duration: 1500
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getStatus (item) {
      if (CheckPermission.hasPermission('prodata:selectbatchbyproid')) {
        this.getDataCountList(item)
      }
    },
    getDataCountList (proId) {
      const params = {
        proId: proId
      }
      Tagging.dataCountList(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          this.dataCountList = data
        } else {
          this.$message({
            message: desc,
            type: 'error',
            duration: 1500
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    receiveHandle (item) { // 领取操作
      this.receiveVisible = true
      this.$nextTick(() => {
        this.$refs.ReceiveComponent.init(item)
      })
    },
    toReceiveList (item) { // 处理操作
      console.log(item)
      this.$router.push({ path: 'receiveList', query: { proId: item.proId, batch: item.batch } })
    },
    handleTabClick (tab) {
      console.log(tab)
      this.searchData.page.currentPage = 1
      this.searchData.page.pageSize = 10
      this.activeName = tab.name
      this.searchData.status = tab.index
      this.getDataList()
    },
    getDataStatus (item) {
      console.log(item)
    },
    // 编辑
    handleEdit (row) {
      this.$router.push({
        name: 'editColumn',
        query: {
          data: row
        }
      })
    },
    // 新增
    addHandle () {
      this.$router.push({
        name: 'addColumn',
        query: {

        }
      })
    },
    // 置空搜索
    resetSearch () {
      this.searchData = {
        proId: '',
        status: 0,
        batch: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      }
      this.dataCountList = []
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
</style>
