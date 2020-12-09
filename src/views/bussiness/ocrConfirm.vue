<template>
  <div class="app-container">
     <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in orderStatusFormat" :key="item.value" :name="item.label" :label="item.label" />
    </el-tabs>
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="测评编号">
        <el-input v-model="searchData.evRecordNo" placeholder="请输入测评编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="searchData.rangeTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
        <el-button type="primary" v-permission="['ev:ocr/batchreceive']" @click="batchHandle()">批量领取</el-button>
        <!-- <el-button type="primary" @click="addHandle()">新增</el-button> -->
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
      <el-table-column label="测评编号" prop="evRecordNo" align="center" header-align="center" min-width="80"/>
      <el-table-column label="提交时间" prop="createTimeDesc" header-align="center" align="center" min-width="80" />
      <el-table-column label="机器识别" prop="ocrStatus" header-align="center" align="center" min-width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ocrStatus">是</el-tag>
          <el-tag v-if="!scope.row.ocrStatus" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否本人" prop="state" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOwner">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click.stop="handleDel(scope.row.cId)">删除</el-button>
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
import Business from '@/api/business'
import Permissions from '@/utils/permissions'

export default {
  data () {
    return {
      list: [],
      listLoading: true,
      activeName: '',
      // 搜索条件
      searchData: {
        evRecordNo: '',
        rangeTime: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      orderStatusFormat: [
        { label: '待领取', value: 1, permission: 'ev:ocr/receivelist' },
        { label: '待处理', value: 2, permission: 'ev:ocr/unmanagelist' },
        { label: '已处理', value: 3, permission: 'ev:ocr/managelist' }
      ],
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  created () {
    this.getDataListHandle()
  },
  components: {
  },
  methods: {
    getDataList () {
      this.searchData.page.currentPage = 1
      this.toSearch()
    },
    toSearch () {
      if (this.activeName === '待领取') {
        this.ungetHandle()
      } else if (this.activeName === '待处理') {
        this.unHandle()
      } else if (this.activeName === '已处理') {
        this.hadHandle()
      }
    },
    getDataListHandle () {
      this.orderStatusFormat = Permissions.checkPermissionList(this.orderStatusFormat)
      this.activeName = this.orderStatusFormat[0].label
      this.toSearch()
    },
    ungetHandle () { // 待领取
      // console.log('待领取')
      this.listLoading = true
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.beginSubmitTime = postData.rangeTime[0]
        postData.endSubmitTime = postData.rangeTime[1]
      }
      Business.ungetHandle(postData).then(res => {
        const { code, desc, data, totalRecord } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.list = data.datas
          this.totalNum = totalRecord
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
    unHandle () { // 待处理
      // console.log('待处理')
      this.listLoading = true
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.beginSubmitTime = postData.rangeTime[0]
        postData.endSubmitTime = postData.rangeTime[1]
      }
      Business.unHandle(postData).then(res => {
        const { code, desc, data, totalRecord } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.list = data.datas
          this.totalNum = totalRecord
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
    hadHandle () { // 已处理
      this.listLoading = true
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.beginSubmitTime = postData.rangeTime[0]
        postData.endSubmitTime = postData.rangeTime[1]
      }
      Business.hadHandle(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.list = []
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
    batchHandle () { // 批量处理

    },
    handleTabClick (tab) {
      this.searchData.page.currentPage = 1
      this.searchData.page.pageSize = 10
      this.activeName = tab.name
      this.toSearch()
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
    // 删除
    handleDel (id) {
      const mythis = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Business.delete(id).then(({ data }) => {
          const { code, msg } = data
          if (code === 200) {
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(err => {
        console.log(err)
        if (err.response) {
          mythis.$message.error(err.response.data.msg)
        } else if (err.request) {
          // 发送请求但是没有响应返回
          console.log(err.request)
        } else {
          console.log('Error', err.msg)
        }
      })
    },
    // 置空搜索
    resetSearch () {
      this.searchData = {
        evRecordNo: '',
        rangeTime: undefined,
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
      this.getDataList()
    },
    // 分页end
    dateFormatter (row, column, cellValue) {
      // return dateSubstring(cellValue)
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
