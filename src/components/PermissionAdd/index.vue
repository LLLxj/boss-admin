<template>
  <el-dialog :close-on-click-modal="false" title="新增权限" :visible.sync="visible" width="50%">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
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
      <el-form-item>
        <el-button type="primary" @click="sumbit()">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Permissions from '@/api/user/permission'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        name: '',
        type: '',
        permission: '',
        url: '',
        sortNo: '',
        parentId: ''
      },
      id: '',
      roleTypeList: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
        { label: '按钮', value: 2 }
      ]
    }
  },
  methods: {
    init (data) {
      if (data) {
        this.visible = true
        this.id = data
        this.dataForm.parentId = data
      }
    },
    getInfo () {
      const params = {
        id: this.id
      }
      Permissions.getInfo(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
        } else {
          this.$message.error(desc)
        }
      })
    },
    sumbit () {
      Permissions.save(this.dataForm).then(res => {
        const { code, desc } = res.data
        if (code === '0000') {
          this.$message({
            message: desc,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('call-back-addHandle')
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
