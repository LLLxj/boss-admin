securitybrain:score/unreceivecount
<template>
  <el-dialog title="领取数据" :visible.sync="visible" :close-on-click-modal="false" width="500px" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="数量:">
        <span v-text="canReceiveNum"></span>
      </el-form-item>
      <el-form-item label="领取条数:" prop="count">
        <el-input-number type="text" v-model="dataForm.count" :min="0" :max="canReceiveNum" placeholder="" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CheckPermission from '@/utils/permissions'
import Safe from '@/api/safe/dataValidation'
export default {
  data () {
    return {
      visible: false,
      canReceiveNum: 0,
      dataForm: {
        count: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      if (CheckPermission.hasPermission('securitybrain:score/members')) {
        this.getReceiveNum()
      }
    },
    getReceiveNum () {
      Safe.getReceiveNum().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.canReceiveNum = data.count
        } else {
          this.$message.error(desc)
        }
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    cancle () {
      this.resetForm()
      this.visible = false
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = {
            count: this.dataForm.count
          }
          Safe.putReceive(params).then(res => {
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
      })
    }
  }
}
</script>

<style>

</style>
