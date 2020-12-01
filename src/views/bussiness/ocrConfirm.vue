<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="测评编号">
        <el-input v-model="searchData.evRecordNo" placeholder="请输入测评编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="searchData.value1" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
        <el-button type="primary" @click="addHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="60" >
      </el-table-column>
      <el-table-column label="测评编号" prop="evRecordNo" align="center" header-align="center" min-width="80"/>
      <el-table-column label="提交时间" prop="createTimeDesc" header-align="center" align="center" min-width="80" />
      <el-table-column label="机器识别" prop="ocrStatus" header-align="center" align="center" min-width="120">
        <template slot-scope="scope">
          <div>{{scope.row.isOwner ? '是' : '否' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否本人" prop="state" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0" type="info">隐藏</el-tag>
          <el-tag v-else>显示</el-tag>
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
    <div class="x-pagination">
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
// import { dateSubstring } from '@/utils/index'

export default {
  data () {
    return {
      list: [],
      listLoading: true,
      // 搜索条件
      searchData: {
        evRecordNo: '',
        value1: ''
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  created () {
    this.getDataList()
  },
  components: {

  },
  methods: {
    getDataList (param) {
      const postData = param || this.searchData
      this.listLoading = true
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
    // 搜索
    search () {
      this.searchData.currentPage = 1
      this.getDataList(this.searchData)
    },
    // 置空搜索
    resetSearch () {
      this.searchData = {
        cName: '',
        url: ''
      }
      this.getDataList(this.searchData)
    },
    // 分页事件
    handleSizeChange (row) {
    // 每页显示数改变
      this.searchData.pageSize = row
      this.getDataList(this.searchData)
    },
    handleCurrentChange (row) {
    // 当前页改变
      this.searchData.currentPage = row
      this.getDataList(this.searchData)
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
</style>
