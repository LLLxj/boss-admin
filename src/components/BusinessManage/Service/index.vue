<template>
  <div>
    <div style="padding: 0 0 10px 0">
      <el-button v-permission="['mer:merservice/add']" type="primary" @click.stop="editHandle()">添加服务</el-button>
    </div>
    <div v-if="list && list.length">
      <el-card v-for="item in list" :key="item.id" class="box-card box-margin">
        <div slot="header" class="clearfix slot-header">
          <div class="left">
            <div class="margin">服务名称:{{item.serviceName}}</div>
            <el-tag v-if="item.configStatus == 1">上线</el-tag>
            <el-tag v-if="item.configStatus == 2" type="info">下线</el-tag>
          </div>
          <div class="right">
            <el-button class="btn-margin" v-permission="['mer:merservice/delete']" type="text" @click="deleteHandle(item.id)">删除</el-button>
            <el-button class="btn-margin" v-permission="['mer:merservice/update']" type="text" @click="editHandle(item)">编辑</el-button>
            <el-tag class="tag-margin" v-if="item.status == 1">激活</el-tag>
            <el-tag class="tag-margin" v-if="item.status == 2" type="info">失效</el-tag>
          </div>
        </div>
        <el-form :model="item" ref="dataForm" label-width="120px">
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="服务编码:">
                <span>{{item.serviceCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期:">
                <span>{{item.startTimeStr}} -{{item.endTimeStr}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务类型:">
                <span v-if="item.serviceType === 3">限次</span>
                <span v-if="item.serviceType === 1">不限次</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.serviceType === 3">
              <el-form-item label="次数:">
                <span>{{item.totalNum}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.serviceType === 3">
              <el-form-item label="剩余次数:">
                <span>{{item.num}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
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
    <ServiceEdit v-if="serviceEditVisible" ref="ServiceEdit" @get-data-list="getInfo" />
  </div>
</template>

<script>
import Business from '@/api/businessManage/business'
import ServiceEdit from '@/components/BusinessManage/ServiceEdit'

export default {
  name: 'service-list',
  data () {
    return {
      listLoading: false,
      list: [],
      id: '',
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 100,
      serviceEditVisible: false
    }
  },
  components: {
    ServiceEdit
  },
  methods: {
    init (id) {
      this.id = id
      this.getInfo()
    },
    getInfo () {
      const params = {
        merId: this.id
      }
      this.listLoading = true
      Business.serviceList(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.list = data.datas
          this.totalNum = data.totalRecord
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    editHandle (item) {
      this.serviceEditVisible = true
      this.$nextTick(() => {
        this.$refs.ServiceEdit.init(item, this.id)
      })
    },
    deleteHandle (id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: id
        }
        Business.deleteService(params).then(res => {
          this.listLoading = false
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getInfo()
              }
            })
          } else {
            this.$message.error(desc)
          }
        })
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-style{
    width: 100%;
    padding: 30px;
  }
  .box-margin{
    margin: 10px 0 0 0;
  }
  .right-margin{
    margin: 0 30px 0 0;
  }
  .row{
    display: flex;
    .button-margin{
      margin: 0 0 0 10px;
    }
  }
  .slot-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      display: flex;
      align-items: center;
      .margin{
        margin: 0 30px 0 0;
        box-sizing: border-box;
      }
    }
    .right{
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      .btn-margin{
        margin: 0 10px;
      }
      .tag-margin{
        margin: 0 10px;
      }
    }
  }
</style>
