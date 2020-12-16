<template>
  <div>
    <div style="padding: 0 0 10px 0">
      <el-button v-permission="['mer:ip/add']" type="primary" @click.stop="addHandle()">添加商户ip</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column header-align="center" align="center" type="index" label="序号" width="80" >
      </el-table-column>
      <el-table-column label="商户IP" prop="ip" align="center" header-align="center" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.id">{{scope.row.ip}}</div>
          <div v-else>
            <el-input v-model="scope.row.ip" placeholder="请输入ip"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button v-permission="['mer:ip/delete']" v-if="scope.row.id" type="text" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
          <el-button v-permission="['mer:ip/add']" v-if="!scope.row.id" :disabled="!scope.row.ip" type="text" @click.stop="saveHandle(scope.row.ip)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Business from '@/api/businessManage/business'
export default {
  name: 'business-ip-delete',
  data () {
    return {
      listLoading: false,
      list: [],
      id: ''
    }
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
      Business.ipList(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.list = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    addHandle () {
      const obj = {
        id: '',
        ip: ''
      }
      this.list.push(obj)
    },
    saveHandle (ip) {
      const params = {
        merId: this.id,
        ip: ip
      }
      Business.saveIp(params).then(res => {
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
      }).catch(err => {
        this.listLoading = false
        console.log(err)
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
        Business.deleteIp(params).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-style{
    width: 100%;
    padding: 30px;
  }
</style>
