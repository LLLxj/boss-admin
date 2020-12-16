<template>
  <el-dialog title="添加商户" :visible.sync="visible" :close-on-click-modal="false" width="500px" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="商户名称:" prop="name">
        <el-input type="text" v-model="dataForm.name" placeholder="请输入商户名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button :disabled="!dataForm.name" type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Business from '@/api/businessManage/business'
export default {
  data () {
    return {
      dataForm: {
        name: ''
      },
      id: '',
      visible: false
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
          Business.save(this.dataForm).then(res => {
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
