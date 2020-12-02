<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="物流状态">
        <el-select v-model="searchData.status" @change="changeStatus" placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" />
      <el-table-column label="用户ID" prop="userId" align="center" header-align="center" />
      <el-table-column label="手机号码" prop="phoneNo" header-align="center" align="center" />
      <el-table-column label="注册时间" prop="createTimeStr" header-align="center" align="center" />
      <el-table-column label="是否填写收货地址" prop="isAddress" header-align="center" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.isAddress === 1 ? '是' : '否' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="物流状态" prop="states" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">已发货</el-tag>
          <el-tag v-if="scope.row.status === 0" type="danger">未发货</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="handleEdit(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination">
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
    <maskDetailPop ref="maskDetailPop" v-if="visible"></maskDetailPop>
  </div>
</template>

<script>
import Mask from '@/api/activities/mask'
import maskDetailPop from './detail'

export default {
  name: 'activities-mask',
  data () {
    return {
      list: [],
      statusList: [
        { label: '全部', value: '' },
        { label: '未发货', value: 0 },
        { label: '已发货', value: 1 }
      ],
      visible: false,
      listLoading: true,
      // 搜索条件
      searchData: {
        status: '',
        page: {
          currentPage: 1,
          pageSize: 10
        }
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  mounted () {
    this.getDataList()
  },
  components: {
    maskDetailPop
  },
  methods: {
    getDataList () {
      const postData = this.searchData
      if (postData.rangeTime && postData.rangeTime.length) {
        postData.beginSubmitTime = postData.rangeTime[0]
        postData.endSubmitTime = postData.rangeTime[1]
      }
      this.listLoading = true
      Mask.list(postData).then(res => {
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
    // 置空搜索
    resetSearch () {
      this.searchData = {
        status: '',
        page: {
          currentPage: 1,
          pageSize: 10
        }
      }
      this.getDataList()
    },
    handleEdit (item) {
      this.$router.push({
        path: 'mask/detail',
        query: {
          id: item
        }
      })
    },
    // 分页事件
    handleSizeChange (row) {
    // 每页显示数改变
      this.searchData.pageSize = row
      this.getDataList()
    },
    handleCurrentChange (row) {
    // 当前页改变
      this.searchData.currentPage = row
      this.getDataList()
    },
    changeStatus (item) {
      this.searchData.status = item
      this.getDataList()
    }
  }
}
</script>
