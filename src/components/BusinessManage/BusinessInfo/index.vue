<template>
  <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="120px">
    <el-form-item label="商户ID:" prop="appId">
      <el-input type="text" v-model="dataForm.appId" disabled placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="商户名称:" prop="name">
      <el-input type="text" v-model="dataForm.name" clearable placeholder="请输入商户名称"></el-input>
    </el-form-item>
    <el-form-item label="开户时间:" prop="createTimeDesc">
      <el-input type="text" v-model="dataForm.createTimeDesc" disabled placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="商户状态:" prop="status">
      <el-select v-model="dataForm.status" clearable placeholder="请选择">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务回调地址:" prop="callbackUrl">
      <el-input type="text" v-model="dataForm.callbackUrl" clearable placeholder="请输入回调地址"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button v-permission="['mer:update']" type="primary" @click="sumbit()">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Business from '@/api/businessManage/business'
export default {
  name: 'business-info',
  data () {
    return {
      listLoading: false,
      dataForm: {
        appId: '',
        name: '',
        createTimeDesc: '',
        status: '',
        callbackUrl: ''
      },
      statusList: [
        { label: '正常', value: 1 },
        { label: '失效', value: 2 }
      ],
      id: '',
      rules: {
        name: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        callbackUrl: [
          { required: true, message: '业务回调地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.id = id
      this.getInfo()
    },
    getInfo () {
      const params = {
        id: this.id
      }
      Business.info(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.dataForm.id,
            name: this.dataForm.name,
            callbackUrl: this.dataForm.callbackUrl,
            status: this.dataForm.status
          }
          Business.updateInfo(params).then(res => {
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
        }
      })
    }
  }
}
</script>

<style>

</style>
