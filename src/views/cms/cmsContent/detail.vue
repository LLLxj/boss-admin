<template>
  <div>
    <el-row :span="24">
      <el-col :span="16">
        <el-form :model="dataForm" ref="dataForm" label-width="120px">
          <el-form-item label="资讯标题:" prop="name">
            <el-input type="text" v-model="dataForm.name" placeholder=""></el-input>
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
                <div class="suggest">图片尺寸240*180</div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="摘要:" prop="summary">
            <el-input type="textarea" v-model="dataForm.summary" :rows="4" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="摘要:" prop="summary">
            <Tinymce ref="editor" v-model="dataForm.parseContent" :height="400"/>
          </el-form-item>
          <el-form-item label="发布平台:" prop="platform">
            <el-radio-group v-model="dataForm.platform">
              <el-radio v-for="item in platformList" :label="item.value" :value="item.value" :key="item.value">{{item.label}}</el-radio>
            </el-radio-group>
            </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CmsContent from '@/api/cms/content'
import System from '@/api/system'
import CheckPermission from '@/utils/permissions'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'cms-cmsContent-detail',
  data () {
    return {
      id: '',
      imageUrl: '',
      uploadUrl: 'https://upload-z2.qiniup.com',
      dataForm: {
        parseContent: ''
      },
      uploadData: {
        key: '',
        token: ''
      },
      platformList: [
        { label: '松果医服', value: 1 },
        { label: '官网', value: 2 },
        { label: 'VIP', value: 9 },
        { label: '所有', value: 99 }
      ]
    }
  },
  components: {
    Tinymce
  },
  created () {
    const id = this.$route.query.id
    if (CheckPermission.hasPermission('cms:getQiNiuToken')) {
      this.getQiniuToken()
    }
    if (id) {
      this.id = id
      this.getInfo()
    }
  },
  methods: {
    getInfo () {
      const params = {
        id: this.id
      }
      CmsContent.info(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          let tempObj = { parseContent: '' }
          tempObj = data
          console.log('----')
          const tempContent = JSON.parse(tempObj.content)
          tempObj.parseContent = tempContent[0].text
          console.log('----')
          // parseContent
          this.dataForm = tempObj
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
          console.log(data)
        } else {
          this.$message.error(desc)
        }
      })
    },
    onSuccess (res, file) {
      this.dataForm.url = process.env.VUE_APP_qiniuUrl + file.response.key
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "src/styles/tinymce.scss";
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
