<template>
  <div class="app-container">
    <div style="text-align:right;padding: 0 0 30px 0">
      <el-button v-permission="['mer:service/config/add']" type="primary" @click="addHandle()">添加服务</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="服务名称" prop="name" header-align="center" align="center" min-width="80" />
      <el-table-column label="服务编码" prop="code" header-align="center" align="center" min-width="80" />
      <el-table-column label="服务标记" prop="tag" header-align="center" align="center" min-width="80" />
      <el-table-column label="服务状态" prop="status" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">上线</el-tag>
          <el-tag v-if="scope.row.status === 2" type="info">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['mer:service/config/delete']" type="text" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.status === 1" v-permission="['mer:service/config/changestatus']" type="text" @click.stop="unLineHandle(scope.row.id, 2)">下线</el-button>
          <el-button v-if="scope.row.status === 2" v-permission="['mer:service/config/changestatus']" type="text" @click.stop="unLineHandle(scope.row.id, 1)">上线</el-button>
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
    <ServiceSetAdd v-if="serviceSetAddVisible" ref="ServiceSetAdd" @get-data-list="getDataList" />

  </div>
</template>

<script>
import ServiceSet from '@/api/businessManage/serviceSet'
import ServiceSetAdd from '@/components/ServiceSetAdd/index'

export default {
  name: 'businessManage-serviceSet',
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
      serviceSetAddVisible: false
    }
  },
  mounted () {
    this.getDataList()
  },
  components: {
    ServiceSetAdd
  },
  methods: {
    getDataList () {
      this.listLoading = true
      const postData = this.searchData
      ServiceSet.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
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
    addHandle () { // 新增
      this.serviceSetAddVisible = true
      this.$nextTick(() => {
        this.$refs.ServiceSetAdd.init()
      })
    },
    unLineHandle (id, status) { // 下线
      const message = status === 2 ? '确认下线？' : '确认上线？'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: id,
          status: status
        }
        ServiceSet.unLine(params).then(res => {
          this.listLoading = false
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(desc)
          }
        })
      })
    },
    deleteHandle (id) { // 删除
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: id
        }
        ServiceSet.delete(params).then(res => {
          this.listLoading = false
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(desc)
          }
        })
      })
    },
    handleSizeChange (row) { // 分页事件
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
