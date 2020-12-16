<template>
  <div class="app-container">
    <div style="text-align:right;padding: 0 0 30px 0">
      <el-button v-permission="['mer:add']" type="primary" @click="addHandle()">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="商户ID" prop="appId" align="center" header-align="center" min-width="120"/>
      <el-table-column label="商户名称" prop="name" header-align="center" align="center" min-width="80" />
      <el-table-column label="开户时间" prop="createTimeDesc" header-align="center" align="center" min-width="80" />
      <el-table-column label="商户状态" prop="status" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">正常</el-tag>
          <el-tag v-if="scope.row.status === 2" type="info">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['mer:detail']" type="text" @click.stop="getDetail(scope.row.id)">查看详情</el-button>
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
    <AddBusiness v-if="addBusinessVisible" ref="AddBusiness" @get-data-list="getDataList" />

  </div>
</template>

<script>
import Business from '@/api/businessManage/business'
import AddBusiness from '@/components/BusinessManage/BusinessManageAdd'

export default {
  name: 'businessManage-businessManagement',
  data () {
    return {
      list: [],
      listLoading: true,
      searchData: {
        page: {
          currentPage: 1,
          pageSize: 10
        }
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      addBusinessVisible: false
    }
  },
  mounted () {
    this.getDataList()
  },
  components: {
    AddBusiness
  },
  methods: {
    getDataList () {
      this.listLoading = true
      const postData = this.searchData
      Business.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
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
    // 编辑
    getDetail (row) {
      this.$router.push({
        name: 'businessManage-businessManagement-detail',
        query: {
          id: row
        }
      })
    },
    // 新增
    addHandle () {
      this.addBusinessVisible = true
      this.$nextTick(() => {
        this.$refs.AddBusiness.init()
      })
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
