<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="角色名">
        <el-input v-model="searchData.name" placeholder="请输入角色名" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否管理员">
        <el-select v-model="searchData.isAdmin" clearable placeholder="请选择">
          <el-option v-for="item in isAdminList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
        <el-button v-permission="['role:save']" type="primary" @click="addHandle()">添加角色</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="角色名" prop="name" header-align="center" align="center" min-width="80" />
      <el-table-column label="是否管理员" prop="isAdmin" header-align="center" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAdmin">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['permission:setpermission']" type="text" @click.stop="editPermission(scope.row.id)">修改权限</el-button>
          <el-button v-permission="['role:delete']" v-if="!scope.row.isAdmin" type="text" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
          <!-- <el-button v-permission="['user:delete']" v-if="scope.row.status === 1" type="text" @click.stop="disableHandle(scope.row.id)">禁用</el-button>
          <el-button v-permission="['user:restore']" v-if="scope.row.status !== 1" type="text" @click.stop="normalHandle(scope.row.id)">启用</el-button> -->
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

    <EditPermission v-if="editPermissionVisible" ref="EditPermission" @get-data-list="getDataList"/>
    <AddRole v-if="addRoleVisible" ref="AddRole" @get-data-list="getDataList"/>
  </div>
</template>

<script>
import Roles from '@/api/user/role'
import EditPermission from '@/components/EditPermission/index'
import AddRole from '@/components/AddRole/index'

export default {
  name: 'user-role',
  data () {
    return {
      list: [],
      listLoading: true,
      // 搜索条件
      searchData: {
        name: '',
        isAdmin: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      isAdminList: [
        { label: '是', value: true },
        { label: '否', value: false },
        { label: '全部', value: '' }
      ],
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      editPermissionVisible: false,
      addRoleVisible: false,
      isRelated: false // 是否有数据关联
    }
  },
  mounted () {
    this.getDataList()
  },
  components: {
    EditPermission, AddRole
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
      Roles.list(postData).then(res => {
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
      this.addRoleVisible = true
      this.$nextTick(() => {
        this.$refs.AddRole.init()
      })
    },
    deleteHandle (id) {
      const params = {
        id: id
      }
      var message = ''
      Roles.relation(params).then(res => {
        const { code, data } = res.data
        if (code === '0000') {
          this.isRelated = data.isRelated
          if (this.isRelated === false) { // 无角色关联
            message = '确认删除吗?'
          } else { // 有角色关联
            message = '此角色有用户关联，确认删除？'
          }
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Roles.delete(params).then(res => {
            const { code, desc } = res.data
            if (code === '0000') {
              this.getDataList()
            } else {
              this.$message.error(desc)
            }
          }).catch(err => {
            this.$message.error(err)
          })
        })
      })
    },
    editPermission (id) {
      this.editPermissionVisible = true
      this.$nextTick(() => {
        this.$refs.EditPermission.init(id)
      })
    },
    // 置空搜索
    resetSearch () {
      this.searchData = {
        isAdmin: '',
        name: '',
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
