<template>
  <div class="cms-container">
    <el-container>
      <el-aside width="350px">
        <CmsSideBar ref="CmsSideBar" @add-handle="addHandle" :show-add-button="true" @get-code-value="getCodeValue"/>
      </el-aside>
      <el-main>
        <el-row :span="24">
          <el-col :span="14" :offset="2">
            <el-form :model="dataForm" ref="dataForm" label-width="120px">
              <el-form-item label="资讯标题:" prop="name">
                <el-input type="text" v-model="dataForm.name" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="分类编码:" prop="code">
                <el-input type="text" v-model="dataForm.code" readonly placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="缩略图:" prop="logisticsCompany">
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
              <el-form-item label="提交日期:" prop="createTimeDesc">
                <el-input type="text" v-model="dataForm.createTimeDesc" readonly placeholder=""></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-permission="['cms:category/add']" :disabled="disBtn" type="primary" @click="updateHandle()">提交</el-button>
                <el-button v-permission="['cms:category/delete']" type="primary" @click="deleteHandle()">删除</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <AddCategory v-if="addCategoryVisible" ref="AddCategory" @get-data-list="getFresh"/>
  </div>
</template>

<script>
import CmsSideBar from '@/components/CmsSideBar'
import CmsCategory from '@/api/cms/category'
import CheckPermission from '@/utils/permissions'
import System from '@/api/system'
import AddCategory from './addCategoty'
export default {
  data () {
    return {
      id: '',
      dataForm: {
        id: '',
        parentId: '',
        code: '',
        templateCode: '',
        name: '',
        url: ''
      },
      uploadUrl: 'https://upload-z2.qiniup.com',
      uploadData: {
        key: '',
        token: ''
      },
      disBtn: false,
      addCategoryVisible: false
    }
  },
  components: {
    CmsSideBar, AddCategory
  },
  created () {
    if (CheckPermission.hasPermission('cms:getQiNiuToken')) {
      this.getQiniuToken()
    }
  },
  methods: {
    getCodeValue (item) {
      this.id = item.id
      if (CheckPermission.hasPermission('cms:category/detail')) {
        this.getInfo()
      }
    },
    addHandle (type, item) {
      this.addCategoryVisible = true
      this.$nextTick(() => {
        this.$refs.AddCategory.init(type, item)
      })
    },
    getFresh () {
      this.$nextTick(() => {
        this.$refs.CmsSideBar.init()
      })
    },
    getInfo (id) {
      const params = {
        id: this.id
      }
      CmsCategory.info(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
        } else {
          this.$message.error(desc)
        }
      })
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
    updateHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.disBtn = true
          const params = this.dataForm
          CmsCategory.update(params).then(res => {
            const { code, desc } = res.data
            if (code === '0000') {
              this.disBtn = false
              this.$message({
                message: desc,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$refs.CmsSideBar.init()
                }
              })
            } else {
              this.disBtn = false
              this.$message.error(desc)
            }
          }).catch(err => {
            this.disBtn = false
            console.log(err)
          })
        }
      })
    },
    deleteHandle () {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.dataForm.id
        }
        CmsCategory.delete(params).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.getFresh()
              }
            })
          } else {
            this.$message.error(desc)
          }
        })
      })
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
