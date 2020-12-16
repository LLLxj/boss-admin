<template>
  <el-dialog title="添加服务" :visible.sync="visible" :close-on-click-modal="false" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="服务名称:" prop="name">
        <el-input type="text" v-model="dataForm.name" clearable placeholder="请输入服务名称"></el-input>
      </el-form-item>
      <el-form-item label="服务编码:" prop="code">
        <el-input type="text" v-model="dataForm.code" clearable placeholder="请输入服务编码"></el-input>
      </el-form-item>
      <el-form-item label="服务标记:" prop="tag">
        <el-input type="text" v-model="dataForm.tag" clearable placeholder="请输入服务标记"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ServiceSet from '@/api/businessManage/serviceSet'

export default {
  name: 'password-key-edit',
  data () {
    return {
      dataForm: {
        name: '',
        code: '',
        tag: ''
      },
      visible: false,
      rules: {
        name: [
          { required: true, message: '服务名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '服务编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          ServiceSet.save(this.dataForm).then(res => {
            const { code, desc } = res.data
            if (code === '0000') {
              this.$message({
                message: desc,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.resetForm()
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
        }
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
