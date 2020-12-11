<template>
  <el-dialog title="重置密码" :visible.sync="visible" :close-on-click-modal="false" width="500px" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="dataForm.password" placeholder="请输入要重置的密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button :disabled="!dataForm.password" type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import User from '@/api/user/user'

import md5 from 'js-md5'
export default {
  data () {
    return {
      dataForm: {
        password: ''
      },
      id: '',
      visible: false,
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.id = id
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.id,
            pwd: md5(this.dataForm.password)
          }
          User.resetPas(params).then(res => {
            const { code, desc } = res.data
            if (code === '0000') {
              this.$message({
                message: desc,
                type: 'success',
                duration: 1500,
                onClose: () => {
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
