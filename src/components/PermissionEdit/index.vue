<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="权限详情" :visible.sync="visible" width="60%">
      <el-form :model="dataForm" ref="dataForm" label-width="100px">
        <el-form-item style="text-align: right">
          <el-button v-permission="['permission:save']" type="primary" @click="addHandle()">新增权限</el-button>
          <el-button v-permission="['permission:delete']" type="danger" @click="deleteHandle()">删除权限</el-button>
        </el-form-item>
        <el-form-item label="权限名称:">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限类型:">
          <el-select v-model="dataForm.type" placeholder="请选择">
            <el-option v-for="item in roleTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限标志:">
          <el-input v-model="dataForm.permission"></el-input>
        </el-form-item>
        <el-form-item label="请求路径:">
          <el-input v-model="dataForm.url"></el-input>
        </el-form-item>
        <el-form-item label="排序号:">
          <el-input v-model="dataForm.sortNo"></el-input>
        </el-form-item>
        <el-form-item label="父ID:">
          <el-input v-model="dataForm.parentId"></el-input>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-input disabled v-model="dataForm.createTimeDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-permission="['permission:update']" type="primary" @click="sumbit()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <AddPermission v-if="addPermissionVisible" ref="AddPermission" @call-back-addHandle="addHandleSuccess()" />
  </div>
</template>

<script>
import Permissions from '@/api/user/permission'
import AddPermission from '@/components/PermissionAdd'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        name: '',
        type: '',
        permission: '',
        url: '',
        sortNo: '',
        parentId: '',
        parentIdPath: '',
        createTimeDesc: ''
      },
      id: '',
      addPermissionVisible: false,
      roleTypeList: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
        { label: '按钮', value: 2 }
      ]
    }
  },
  components: {
    AddPermission
  },
  methods: {
    init (data) {
      console.log('点击菜单的id')
      console.log(data)
      if (data) {
        this.visible = true
        this.id = data
        this.getInfo()
      }
    },
    getInfo () {
      const params = {
        id: this.id
      }
      Permissions.getInfo(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          this.dataForm = data
        } else {
          this.$message.error(desc)
        }
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    cancle () {
      this.visible = false
      this.resetForm()
    },
    addHandle () {
      console.log('新增操作')
      this.addPermissionVisible = true
      const id = this.dataForm.id
      this.$nextTick(() => {
        this.$refs.AddPermission.init(id)
      })
    },
    deleteHandle () {
      console.log('删除操作')
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.dataForm.id
        }
        Permissions.delete(params).then(res => {
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
        })
      })
    },
    addHandleSuccess () {
      this.visible = false
      this.$emit('get-data-list')
    },
    sumbit () {
      const params = {
        id: this.dataForm.id,
        name: this.dataForm.name,
        type: this.dataForm.type,
        permission: this.dataForm.permission,
        url: this.dataForm.url,
        parentId: this.dataForm.parentId,
        parentIdPath: this.dataForm.parentIdPath,
        sortNo: this.dataForm.sortNo
      }
      Permissions.update(params).then(res => {
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
      })
    }
  }

}
</script>

<style>

</style>
