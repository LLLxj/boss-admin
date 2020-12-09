<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <el-form :model="dataForm" ref="dataForm" label-width="200px">
        <el-form-item label="测评编号：">
          <el-input v-model="dataForm.serialNumber" readonly></el-input>
        </el-form-item>
        <el-form-item label="商户ID：">
          <el-input v-model="dataForm.appId" readonly></el-input>
        </el-form-item>
        <el-form-item label="商户名称：">
          <el-input v-model="dataForm.merName" readonly></el-input>
        </el-form-item>
        <el-form-item label="销售渠道：">
          <el-input v-model="dataForm.channelName" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户唯一标识：">
          <el-input v-model="dataForm.guId" readonly></el-input>
        </el-form-item>
        <el-form-item label="商户订单号：">
          <el-input v-model="dataForm.bzId" readonly></el-input>
        </el-form-item>
        <el-form-item label="提交时间：">
          <el-input v-model="dataForm.createTimeDesc" readonly></el-input>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="dataForm.productName" readonly></el-input>
        </el-form-item>
        <el-form-item label="保险公司：">
          <el-input v-model="dataForm.cpName" readonly></el-input>
        </el-form-item>
        <el-form-item label="图片：" v-if="dataForm.imgs">
          <viewer :images="[dataForm.imgs[imgIndex].imgUrl]" class="img_size">
            <img style="width: 200px;height: 150px;display: inline-block" v-for="(item, index) in [dataForm.imgs[imgIndex].imgUrl]" :src="item" :key="index">
          </viewer>
          <div>
            <el-button :disabled="imgIndex === 0" type="text" @click="prePage()">上一页</el-button>
            <el-button :disabled="imgIndex === dataForm.imgs.length - 1" type="text" @click="nextPage()">下一页</el-button>
            <el-button type="text" @click="downloadIamge('263440')">图片下载</el-button>（共{{dataForm.imgs.length}}张）
          </div>
        </el-form-item>
        <el-form-item label="超声文本：" v-if="dataForm.imgs">
          <el-input v-model="dataForm.imgs[imgIndex].content" type="textarea" readonly></el-input>
        </el-form-item>
        <el-form-item label="ACR评级：">
          <el-input v-model="dataForm.acrCategory" readonly></el-input>
        </el-form-item>
        <el-form-item label="TI评级：">
          <el-input v-model="dataForm.tiRads" readonly></el-input>
        </el-form-item>
        <el-form-item label="惠美诊断结果：">
          <el-input v-model="dataForm.hmThyroidTiDto" readonly></el-input>
        </el-form-item>
        <el-form-item label="最终ACR评级：">
          <el-input v-model="dataForm.acrCategoryResult" readonly></el-input>
        </el-form-item>
        <el-form-item label="最终TI评级：">
          <el-input v-model="dataForm.tiRadsResult" readonly></el-input>
        </el-form-item>
        <el-form-item label="核保结果：">
          <span v-if="dataForm.acrCategoryResult == 'TR4' || dataForm.acrCategoryResult == 'TR5'">核保不通过</span>
          <span v-else>核保通过</span>
          <!-- <el-input v-if="dataForm.acrCategoryResult == 'TR4' || dataForm.acrCategoryResult == 'TR5'" v-model="dataForm.acrCategoryResult" readonly></el-input> -->
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import MeasureSearch from '@/api/statistics/measureSearch'
import CheckPermission from '@/utils/permissions'
export default {
  name: 'statistics-measureSearch-detail',
  data () {
    return {
      listLoading: false,
      visible: false,
      dataForm: {
      },
      id: '',
      imgIndex: 0
    }
  },
  created () {
    const id = this.$route.query.id
    if (CheckPermission.hasPermission('pf:ev/detail') && id) {
      this.getInfo(id)
    }
  },
  computed: {
  },
  methods: {
    getInfo (id) {
      const params = {
        id: id
      }
      this.listLoading = true
      MeasureSearch.info(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataForm = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        this.$message.error(err)
      })
    },
    prePage () {
      if (this.imgIndex !== 0) {
        this.imgIndex -= 1
      }
    },
    nextPage () {
      if (this.imgIndex !== this.dataForm.imgs.length - 1) {
        this.imgIndex += 1
      }
    },
    downloadIamge (name) {
      const src = this.dataForm.imgs[this.imgIndex].imgUrl
      var canvas = document.createElement('canvas')
      var img = document.createElement('img')
      img.onload = function (e) {
        canvas.width = img.width
        canvas.height = img.height
        var context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, img.width, img.height)
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
        canvas.toBlob((blob) => {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = name || 'photo'
          link.click()
        }, 'image/jpeg')
      }
      img.setAttribute('crossOrigin', 'Anonymous')
      img.src = src
    }
  }

}
</script>

<style lang="scss" scoped>
  .row{
    text-align:right;
    color: #aaa;
    font-size: 18px;
    padding: 20px 0;
  }
</style>
