<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="账号">
        <el-input v-model="searchData.account" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchData.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchData.status" placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
        <el-button type="primary" @click="addHandle()">创建用户</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="账号" prop="account" align="center" header-align="center" min-width="80"/>
      <el-table-column label="姓名" prop="name" header-align="center" align="center" min-width="80" />
      <el-table-column label="角色" prop="bossRoles" header-align="center" align="center" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.bossRoles && scope.row.bossRoles.length">
            <el-tag style="margin: 0 0 0 10px" v-for="item in scope.row.bossRoles" :key="item.id">{{item.name}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">正常</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['user:setroles']" type="text" @click.stop="editRoles(scope.row.id)">修改角色</el-button>
          <el-button v-permission="['user:resetpwd']" type="text" @click.stop="resetPas(scope.row.id)">重置密码</el-button>
          <el-button v-permission="['user:delete']" v-if="scope.row.status === 1" type="text" @click.stop="disableHandle(scope.row.id)">禁用</el-button>
          <el-button v-permission="['user:restore']" v-if="scope.row.status !== 1" type="text" @click.stop="normalHandle(scope.row.id)">启用</el-button>
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

    <ResetPas v-if="resetPasVisible" ref="ResetPas" @get-data-list="getDataList"/>
    <EditRoles v-if="editRolesVisible" ref="EditRoles" @get-data-list="getDataList" />
    <CreateUser v-if="createUserVisible" ref="CreateUser" @get-data-list="getDataList" />
  </div>
</template>

<script>
import User from '@/api/user/user'
import ResetPas from '@/components/ResetPas/index'
import EditRoles from '@/components/EditRoles/index'
import CreateUser from '@/components/CreateUser/index'

export default {
  name: 'user-list',
  data () {
    return {
      list: [],
      listLoading: true,
      activeName: '',
      // 搜索条件
      searchData: {
        account: '',
        name: '',
        status: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      statusList: [
        { label: '已停用', value: 0 },
        { label: '正常', value: 1 },
        { label: '全部', value: '' }
      ],
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      resetPasVisible: false,
      editRolesVisible: false,
      createUserVisible: false
    }
  },
  mounted () {
    this.getDataList()
  },
  components: {
    ResetPas, EditRoles, CreateUser
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
      User.list(postData).then(res => {
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
      this.createUserVisible = true
      this.$nextTick(() => {
        this.$refs.CreateUser.init()
      })
    },
    normalHandle (id) { // 启用
      const mythis = this
      this.$confirm('确定启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          id: id
        }
        User.normal(obj).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            mythis.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                mythis.getDataList()
              }
            })
          } else {
            mythis.$message.error(desc)
          }
        })
      }).catch(err => {
        console.log(err)
        mythis.$message.error(err)
      })
    },
    disableHandle (id) { // 禁用
      const mythis = this
      this.$confirm('确定禁用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          id: id
        }
        User.disable(obj).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            mythis.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                mythis.getDataList()
              }
            })
          } else {
            mythis.$message.error(desc)
          }
        })
      }).catch(err => {
        console.log(err)
        mythis.$message.error(err)
      })
    },
    resetPas (id) {
      this.resetPasVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPas.init(id)
      })
    },
    editRoles (id) {
      this.editRolesVisible = true
      this.$nextTick(() => {
        this.$refs.EditRoles.init(id)
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
