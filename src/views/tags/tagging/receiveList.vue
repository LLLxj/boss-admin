<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="状态选择:">
        <el-select v-model="searchData.status" @change="getStatus" clearable filterable placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文本查询:">
        <el-input v-model="searchData.content" placeholder="请输入查询条件" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
        <el-button type="primary" @click="getDataListHandle()">提交审核</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
      <el-table-column label="文本" prop="content" align="center" header-align="center" min-width="200"/>
      <el-table-column label="状态" prop="status" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="info">未完成</el-tag>
          <el-tag v-if="scope.row.status === 2">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeDesc" header-align="center" align="center" label="最后操作时间">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">{{ scope.row.receiveTimeDesc }}</span>
          <span v-if="scope.row.status === 2">{{ scope.row.handleTimeDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button v-permission="['prodata:update']" v-if="scope.row.status === 1" type="text" @click="toTakeTag(1, scope.row.id)">处理</el-button>
          <el-button v-permission="['prodata:submit']" v-if="scope.row.status === 2" type="text" @click="toTakeTag(2, scope.row.id)">修改</el-button>
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
import Receive from '@/api/tag/receive'
import CheckPermission from '@/utils/permissions'
import ReceiveComponent from './receivePop'

export default {
  name: 'tags-receive-list',
  data () {
    return {
      list: [],
      listLoading: false,
      proList: [],
      dataCountList: [],
      // 搜索条件
      searchData: {
        proId: '',
        status: '',
        content: '',
        batch: '',
        diseaseCode: 'thyroid',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      statusList: [
        { label: '未完成', value: 1 },
        { label: '已完成', value: 2 }
      ],
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      receiveVisible: false
    }
  },
  created () {
    const proId = this.$route.query.proId
    const batch = this.$route.query.batch
    this.searchData.proId = proId
    this.searchData.batch = batch
    console.log(proId)
    console.log(batch)
    if (CheckPermission.hasPermission('prodata:selectdata/page')) {
      this.getDataListHandle()
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
      Receive.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          // 处理数据
          this.listLoading = false
          if (data) {
            this.list = data.datas
            this.totalNum = data.totalRecord
          }
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
      Receive.selectproList().then(res => {
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
      Receive.dataCountList(params).then(res => {
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
    toTakeTag (type, id) { // 修改、处理操作
      this.$router.push({ path: 'takeTag', query: { type: type, id: id, batch: this.searchData.batch, proId: this.searchData.proId } })
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
