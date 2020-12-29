<template>
  <el-dialog :title="type === 'parent' ? '新增一级分类' : '新增子分类'" :visible.sync="visible" :close-on-click-modal="false" width="600px" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="120px">
      <el-form-item label="名称:" prop="name">
        <el-input type="text" v-model="dataForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="编码:" prop="code">
        <el-input type="text" v-model="dataForm.code" placeholder="请用名称英文代表编码"></el-input>
      </el-form-item>
      <el-form-item label="图片:" prop="url" v-if="type === 'parent'">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :data="uploadData"
          :show-file-list="false"
          :on-success="onSuccess">
          <div class="row">
            <img v-if="dataForm.url" :src="dataForm.url" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="type === 'children'" label="选择模板:" prop="templateCode">
        <el-select v-model="dataForm.templateCode" placeholder="请选择模板">
          <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" ></el-option>
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
import System from '@/api/system'
import CmsCategory from '@/api/cms/category'
import CheckPermission from '@/utils/permissions'
export default {
  data () {
    return {
      dataForm: {
        code: '',
        name: '',
        url: '',
        templateCode: '',
        parentId: ''
      },
      disBtn: false,
      uploadUrl: 'https://upload-z2.qiniup.com',
      uploadData: {
        key: '',
        token: ''
      },
      typeOption: [
        {
          label: '模板1',
          value: 'MODELONE'
        },
        {
          label: '模板2',
          value: 'MODELTWO'
        }
      ],
      id: '',
      visible: false,
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: '模板不能为空', trigger: 'blur' }
        ]
      },
      selectItem: {},
      type: ''
    }
  },
  methods: {
    init (type, item) {
      this.visible = true
      this.type = type
      console.log(type)
      console.log(item)
      if (item) {
        this.selectItem = item
        this.dataForm.parentId = item.id
      }
      if (CheckPermission.hasPermission('cms:getQiNiuToken')) {
        this.getQiniuToken()
      }
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.selectItem = {}
    },
    getQiniuToken () {
      System.getQiniuToken().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.uploadData = {
            key: data.key,
            token: data.qiNiuToken
          }
        } else {
          this.$message.error(desc)
        }
      })
    },
    onSuccess (res, file) {
      this.dataForm.url = process.env.VUE_APP_qiniuUrl + file.response.key
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = this.dataForm
          CmsCategory.save(params).then(res => {
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

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    margin: 0 30px 0 0;
  }
  .row{
    display: flex;
    .suggest{
      width: 178px;
      height: 178px;
      line-height: 178px;
    }
  }
</style>
