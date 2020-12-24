<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="病种:">
        <el-select v-model="searchData.diseaseCode" @change="getDiseaseStatus" placeholder="请选择">
          <el-option v-for="item in diseaseList" :key="item.diseaseCode" :label="item.diseaseName" :value="item.diseaseCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据批次:">
        <el-select v-model="searchData.batch" placeholder="请选择">
          <el-option v-for="item in dataCountList" :key="item.batch" :label="item.batch" :value="item.batch">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataListHandle()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="唯一标识码" prop="unique" align="center" header-align="center" min-width="80"/>
      <el-table-column label="超声描述" prop="content" header-align="center" align="center" min-width="80" />
      <el-table-column label="病理报告" prop="pathologyDiagnosis" header-align="center" align="center" min-width="80" />
      <el-table-column label="提交时间" prop="submitTimeDesc" header-align="center" align="center" min-width="80" />
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
import DataQuery from '@/api/tag/dataQuery'

export default {
  name: 'user-list',
  data () {
    return {
      list: [],
      diseaseList: [],
      dataCountList: [],
      listLoading: false,
      activeName: '',
      // 搜索条件
      searchData: {
        batch: '',
        diseaseCode: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100
    }
  },
  created () {
    // this.getDataList()
    this.getDiseaseList()
    // this.getDataCountList()
  },
  components: {
  },
  methods: {
    getDataListHandle () {
      this.searchData.page.currentPage = 1
      this.currentPage = 1
      this.getDataList()
    },
    getDiseaseList () {
      DataQuery.getDiseaseList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.diseaseList = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getDiseaseStatus (item) {
      this.getDataCountList()
    },
    getDataCountList () {
      const params = {
        diseaseCode: this.searchData.diseaseCode
      }
      DataQuery.getDataCountList(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataCountList = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getDataList () {
      this.listLoading = true
      const postData = this.searchData
      DataQuery.list(postData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          // 处理数据
          this.listLoading = false
          this.list = data.datas
          this.totalNum = data.totalRecord
        } else {
          this.listLoading = false
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    resetSearch () {
      this.searchData = {
        batch: '',
        diseaseCode: '',
        page: {
          pageSize: 10,
          currentPage: 1
        }
      }
      this.list = []
    },
    handleSizeChange (row) {
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
<style>
</style>
