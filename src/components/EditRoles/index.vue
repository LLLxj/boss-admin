<template>
  <el-dialog title="分配角色" :visible.sync="visible" :close-on-click-modal="false" width="800px">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="管理员:" prop="adminList">
        <el-checkbox-group v-model="dataForm.adminList" @change="handleAdmin">
          <el-checkbox v-for="item in adminList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="非管理员:" prop="unAdminList">
        <el-checkbox-group v-model="dataForm.unAdminList" @change="handleUnadmin">
          <el-checkbox v-for="item in unAdminList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import User from '@/api/user/user'

export default {
  data () {
    return {
      dataForm: {
        adminList: [],
        unAdminList: []
      },
      selectList: [],
      adminList: [],
      unAdminList: [],
      id: '',
      visible: false
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.roleListAll()
      if (id) {
        this.id = id
      }
    },
    async roleListAll () {
      const result = await User.roleListAll()
      const { code, data, desc } = result.data
      if (code === '0000') {
        this.adminList = data.filter(item => item.isAdmin)
        this.unAdminList = data.filter(item => !item.isAdmin)
        this.getInfo()
      } else {
        this.$message.error(desc)
      }
    },
    getInfo () {
      const params = {
        userId: this.id
      }
      User.userRoleList(params).then(res => {
        const { code, data, desc } = res.data
        if (code === '0000') {
          this.selectList = []
          this.dataForm.adminList = []
          this.dataForm.unAdminList = []
          const adminList = data.filter(item => item.isAdmin)
          const unAdminList = data.filter(item => !item.isAdmin)
          adminList.forEach(item => {
            this.dataForm.adminList.push(item.id)
          })
          unAdminList.forEach(item => {
            this.dataForm.unAdminList.push(item.id)
          })
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err)
      })
    },
    resetForm () {
      // this.$nextTick(() => {
      this.$refs.dataForm.resetFields()
      // })
    },
    handleAdmin (item) {
      console.log(item)
    },
    handleUnadmin (item) {
      console.log(item)
    },
    sumbit () {
      const checkAll = [...this.dataForm.adminList, ...this.dataForm.unAdminList]
      var ids = ''
      checkAll.forEach(item => {
        ids += item + ','
      })
      ids = ids.substr(0, ids.length - 1)
      const params = {
        userId: this.id,
        roleIds: ids
      }
      User.updateRoles(params).then(res => {
        const { code, desc } = res.data
        if (code === '0000') {
          this.$message({
            message: desc,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('get-data-list')
            }
          })
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err)
      })
    },
    cancle () {
      this.visible = false
      this.resetForm()
    }
  }
}
</script>

<style>

</style>
