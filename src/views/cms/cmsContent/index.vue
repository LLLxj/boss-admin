<template>
  <div class="cms-container">
    <el-container>
      <el-aside width="250px">
        <CmsSideBar @get-code-value="getCodeValue"/>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane v-for="item in statusList" :key="item.value" :name="item.label" :label="item.label" />
        </el-tabs>
        <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
          <!-- <el-form-item label="标题">
            <el-input v-model="searchData.title" maxlength="11" placeholder="按标题搜索" clearable></el-input>
          </el-form-item> -->
          <el-form-item>
            <!-- <el-button type="primary" icon="el-icon-search" @click="getDataListHandle()">查询</el-button> -->
            <el-button v-permission="['cms:content/add']" type="primary" @click="addHandle()">新增</el-button>
            <el-button :disabled="selectList && selectList.length ? false : true" v-permission="['cms:content/remove']" type="primary" @click="unlineHandle()">下架</el-button>
            <el-button :disabled="selectList && selectList.length ? false : true" v-permission="['cms:content/delete']" type="primary" @click="deleteHandle()">删除</el-button>
            <el-button :disabled="selectList && selectList.length ? false : true" v-permission="['cms:content/publish']" type="primary" @click="publishHandle()">发布</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" fit highlight-current-row @selection-change="handleSelection">
          <el-table-column type="selection" width="50" />
          <el-table-column label="序号" header-align="center" align="center" type="index" width="50" />
          <el-table-column label="文章ID" prop="id" align="center" header-align="center" width="80"/>
          <el-table-column :label="selectItem.name === '疾病介绍' ? '疾病名称' : '资讯标题'" header-align="center" align="center" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.name.length > 10">{{scope.row.name.substring(0,10) + '...'}}</span>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布人员" prop="creatorName" align="center" header-align="center" width="120"/>
          <el-table-column label="发布时间" prop="publishTimeDesc" align="center" header-align="center" width="160"/>
          <el-table-column label="状态" prop="status" align="center" header-align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="info">存草稿</el-tag>
              <el-tag v-if="scope.row.status === 2" type="warning">待审核</el-tag>
              <el-tag v-if="scope.row.status === 3" type="warning" effect="plain">审核不通过</el-tag>
              <el-tag v-if="scope.row.status === 4" effect="plain">待发布</el-tag>
              <el-tag v-if="scope.row.status === 5">已发布</el-tag>
              <el-tag v-if="scope.row.status === 6" type="info" effect="plain">已下架</el-tag>
              <el-tag v-if="scope.row.status === 7" type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="浏览数" prop="viewCount" align="center" header-align="center" width="100"/>
          <el-table-column label="提交时间" align="center" header-align="center" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">{{scope.row.createTimeDesc}}</span>
              <span v-else>{{scope.row.submitTimeDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="290" align="center" header-align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-permission="['cms:content/detail']" type="text" @click="copyHandle(scope.row)">复制</el-button>
              <el-button v-if="scope.row.status === 4 || scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 6" v-permission="['cms:content/detail']" type="text" @click="getDetailHandle(scope.row)">详情</el-button>
              <el-button v-if="scope.row.status === 1 || scope.row.status === 3" v-permission="['cms:content/update']" type="text" @click="editHandle(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === 5" v-permission="['cms:content/superupdate']" type="text" @click="editHandle(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === 1 || scope.row.status === 3 || scope.row.status === 6" v-permission="['cms:content/delete']" type="text" @click="deleteHandle(scope.row)">删除</el-button>
              <el-button v-if="scope.row.status === 2" v-permission="['cms:content/audit']" type="text" @click="checkHandle(scope.row)">审核</el-button>
              <el-button v-if="scope.row.status === 4" v-permission="['cms:content/publish']" type="text" @click="publishHandle(scope.row)">发布</el-button>
              <el-button v-if="scope.row.status === 5" v-permission="['cms:content/remove']" type="text" @click="unlineHandle(scope.row)">下架</el-button>
              <el-button v-if="scope.row.status === 5 && scope.row.sortStatus === 1" v-permission="['cms:content/sortdelete']" type="text" @click="cancleOrderhandle(scope.row, 'top')">取消置顶</el-button>
              <el-button v-if="scope.row.status === 5 && scope.row.sortStatus === 5" v-permission="['cms:content/sortadd']" type="text" @click="setOrderHandle(scope.row, 'top')">置顶</el-button>
              <el-button v-if="scope.row.status === 5 && scope.row.sortStatus === 5" v-permission="['cms:content/sortadd']" type="text" @click="setOrderHandle(scope.row, 'bottom')">置底</el-button>
              <el-button v-if="scope.row.status === 5 && scope.row.sortStatus === 10" v-permission="['cms:content/sortdelete']" type="text" @click="cancleOrderhandle(scope.row, 'bottom')">取消置底</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CmsSideBar from '@/components/CmsSideBar'
import CmsContent from '@/api/cms/content'
export default {
  name: 'cms-cmsContent',
  data () {
    return {
      activeName: '全部',
      listLoading: false,
      selectItem: {},
      selectList: [],
      statusList: [
        { label: '全部', value: '' },
        { label: '已发布', value: 5 },
        { label: '待审核', value: 2 },
        { label: '待发布', value: 4 },
        { label: '审核不通过', value: 3 },
        { label: '已下架', value: 6 },
        { label: '已删除', value: 7 },
        { label: '存草稿', value: 1 }
      ],
      searchData: {
        code: '',
        page: {
          currentPage: 1,
          pageSize: 10
        },
        status: ''
      },
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      list: [],
      treeshowName: ''
    }
  },
  components: {
    CmsSideBar
  },
  methods: {
    getDataListHandle () {
      this.searchData.page.currentPage = 1
      this.currentPage = 1
      this.getDataList()
    },
    handleTabClick (item) {
      this.activeName = item.name
      this.statusList.forEach(staItem => {
        if (staItem.label === item.name) {
          this.searchData.status = staItem.value
        }
      })
      this.getDataList()
    },
    getCodeValue (item) { // 获取code值
      this.selectItem = item
      this.searchData.code = item.code
      this.getDataList()
    },
    getDataList () {
      this.listLoading = true
      const params = this.searchData
      CmsContent.list(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.list = data.datas
          this.totalNum = data.totalRecord
        } else {
          this.$message.error(desc)
        }
      })
    },
    addHandle () { // 新增
      console.log('addHandle')
      const item = {}
      const type = 'add'
      this.toEdit(item, type)
    },
    copyHandle (item) { // 复制
      const type = 'copy'
      console.log('publishHandle')
      this.toEdit(item, type)
    },
    getDetailHandle (item) { // 详情
      const type = 'detail'
      console.log('getDetailHandle')
      this.toEdit(item, type)
    },
    editHandle (item) { // 编辑
      const type = 'update'
      console.log('editHandle')
      this.toEdit(item, type)
    },
    deleteHandle (item) { // 删除
      console.log(item)
      let params = { ids: '' }
      if (item) { // 单选删除
        params = {
          ids: item.id
        }
      } else { // 批量删除
        params = {
          ids: this.selectList
        }
      }
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CmsContent.delete(params).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataListHandle()
              }
            })
          }
        })
      })
      console.log(params)
      console.log('deleteHandle')
    },
    checkHandle (item) { // 审核
      const type = 'check'
      console.log('checkHandle')
      this.toEdit(item, type)
    },
    publishHandle (item) { // 发布
      console.log('publishHandle')
      let params = { ids: '' }
      if (item) { // 单选删除
        params = {
          ids: item.id
        }
      } else { // 批量删除
        params = {
          ids: this.selectList
        }
      }
      this.$confirm('确认发布吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CmsContent.publish(params).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataListHandle()
              }
            })
          }
        })
      })
    },
    unlineHandle (item) { // 下架
      console.log('unLineHandle')
      let params = { ids: '' }
      if (item) { // 单选删除
        params = {
          ids: item.id
        }
      } else { // 批量删除
        params = {
          ids: this.selectList
        }
      }
      this.$confirm('确认下架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CmsContent.unline(params).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataListHandle()
              }
            })
          }
        })
      })
    },
    setOrderHandle () { // 置顶 top、bottom
      console.log('setOrderHandle')
    },
    cancleOrderhandle () { // 取消置顶 top、bottom
      console.log('cancleOrderhandle')
    },
    toEdit (item, type) {
      console.log(item)
      console.log('跳转路由')
      console.log(this.selectItem)
      this.$router.push({
        path: 'cmsContentDetail',
        query: {
          id: item.id,
          handleType: type,
          articleType: this.selectItem.name
        }
      })
    },
    handleSelection (data) {
      var tempData = ''
      data.forEach((item, index) => {
        tempData += item.id + ','
      })
      tempData = tempData.substr(0, tempData.length - 1)
      this.selectList = tempData
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

<style lang="scss" scoped>
  .cms-container{
    .el-main{
      overflow: hidden;
    }
  }
</style>
