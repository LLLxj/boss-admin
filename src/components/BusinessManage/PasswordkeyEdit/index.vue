<template>
  <el-dialog :title="dataForm.id ? '编辑密钥' : '添加密钥'" :visible.sync="visible" :close-on-click-modal="false" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="密钥:" prop="secretKey">
        <el-input type="text" v-model="dataForm.secretKey" placeholder="请输入密钥"></el-input>
      </el-form-item>
      <el-form-item label="有效期:">
        <el-date-picker v-model="dataForm.expireTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商户状态:" prop="status">
        <el-select v-model="dataForm.status" clearable placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Business from '@/api/businessManage/business'

export default {
  name: 'password-key-edit',
  data () {
    return {
      dataForm: {
        secretKey: '',
        expireTime: '',
        status: 1,
        id: '',
        merId: ''
      },
      id: '',
      statusList: [
        { label: '正常', value: 1 },
        { label: '失效', value: 2 }
      ],
      visible: false,
      rules: {
        secretKey: [
          { required: true, message: 'key不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (item, merId) {
      console.log(item)
      console.log(merId)
      this.visible = true
      if (item) {
        this.id = item.id
        this.dataForm = {
          id: item.id,
          secretKey: item.secretKey,
          expireTime: item.expireTimeDesc,
          status: item.status
        }
      } else {
        this.dataForm = {
          merId: merId,
          secretKey: '',
          expireTime: '',
          status: 1
        }
      }
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.dataForm.id) {
            Business.updateKey(this.dataForm).then(res => {
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
          } else {
            Business.saveKey(this.dataForm).then(res => {
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
