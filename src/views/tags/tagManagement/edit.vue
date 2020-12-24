<template>
  <el-dialog :title="type === 2 ? '新增标签（打标签）' : '新增标签（打分）'" :visible.sync="visible" :close-on-click-modal="false" width="500px" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="标签中文:" prop="cnName" v-if="type === 2">
        <el-input type="text" v-model="dataForm.cnName" placeholder="请输入标签中文"></el-input>
      </el-form-item>
      <el-form-item label="分数:" prop="label" v-if="type === 1">
        <el-input type="text" v-model="dataForm.label" placeholder="请输入分数"></el-input>
      </el-form-item>
      <el-form-item label="标签英文:" prop="enName">
        <el-input type="text" v-model="dataForm.enName" placeholder="请输入标签英文"></el-input>
      </el-form-item>
    </el-form>
    <!-- "featureId": that.characteristic,
            "enName": that.addtagEg,
            "cnName": '',
            "label": that.addtagZh -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TagManage from '@/api/tag/tagManage'
export default {
  data () {
    return {
      dataForm: {
        featureId: '',
        cnName: '',
        label: '',
        enName: ''
      },
      id: '',
      type: '',
      visible: false,
      rules: {
        cnName: [
          { required: true, message: '标签中文不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '分数不能为空', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '标签英文不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (featureId, type) {
      this.visible = true
      this.type = type
      this.dataForm.featureId = featureId
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = this.dataForm
          TagManage.save(params).then(res => {
            const { code, desc } = res.data
            if (code === '0000') {
              this.$message({
                message: desc,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.resetForm()
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
