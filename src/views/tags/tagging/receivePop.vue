<template>
  <el-dialog title="领取" :visible.sync="visible" :close-on-click-modal="false" width="500px" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="领取数量:" prop="count">
        <el-input-number v-model="dataForm.count" :min="1" class="box-input" :max="1000" controls-position="right" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button :disabled="!dataForm.count" type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tag from '@/api/tag/tagging'

export default {
  data () {
    return {
      dataForm: {
        id: '',
        count: ''
      },
      visible: false
    }
  },
  methods: {
    init (id) {
      console.log(id)
      this.visible = true
      this.dataForm.id = id
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          Tag.receive(this.dataForm).then(res => {
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
