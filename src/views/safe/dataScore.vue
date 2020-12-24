<template>
  <div class="dataScore">
    <el-form :model="dataForm" ref="dataForm" label-width="120px">
      <el-row :span="24">
        <el-col :span="13">
          <el-form-item label="图片:" label-width="60px">
            <viewer :images="[dataForm.imgUrl]">
              <img class="img-src" v-for="(item, index) in [dataForm.imgUrl]" :src="item" :key="index">
            </viewer>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="测评编号:">
            <span v-text="dataForm.serialNumber"></span>
          </el-form-item>
          <el-form-item label="商户ID:" >
            <span v-text="dataForm.appId"></span>
          </el-form-item>
          <el-form-item label="商户名称:" >
            <span v-text="dataForm.merName"></span>
          </el-form-item>
          <el-form-item label="销售渠道:" >
            <span v-text="dataForm.channelName"></span>
          </el-form-item>
          <el-form-item label="用户唯一标识:" >
            <span v-text="dataForm.guId"></span>
          </el-form-item>
          <el-form-item label="商户订单号:" >
            <span v-text="dataForm.bzId"></span>
          </el-form-item>
          <el-form-item label="提交时间:" >
            <span v-text="dataForm.submitTimeDesc"></span>
          </el-form-item>
          <el-form-item label="产品名称:" >
            <span v-text="dataForm.productName"></span>
          </el-form-item>
          <el-form-item label="保险公司:" >
            <span v-text="dataForm.cpName"></span>
          </el-form-item>
          <el-form-item label="ACR评级:" >
            <span v-text="dataForm.acrCategory"></span>
          </el-form-item>
          <el-form-item label="TI评级:" >
            <span v-text="dataForm.tiRads"></span>
          </el-form-item>
          <el-form-item label="惠美诊断结果:" >
            <span v-text="dataForm.hmThyroidTiDto"></span>
          </el-form-item>
          <el-form-item label="最终ACR评级:" >
            <span v-text="dataForm.finalAcrCategory"></span>
          </el-form-item>
          <el-form-item label="最终TI评级:" >
            <span v-text="dataForm.finalTiRads"></span>
          </el-form-item>
          <el-form-item label="核保结果:" >
            <span v-if="dataForm.isPass">是</span>
            <span v-if="!dataForm.isPass">否</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24" style="margin: 30px 0 0 0">
        <el-col :span="13">
          <el-form-item label="超声文本:">
            <el-input type="textarea" v-model="dataForm.originText" readonly :rows="8"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="是否无效图片:">
            <el-radio v-if="type === 3" disabled v-model="dataForm.isValidPic" :label="true">是</el-radio>
            <el-radio v-if="type === 3" disabled v-model="dataForm.isValidPic" :label="false">否</el-radio>
            <el-radio v-if="type === 2" v-model="dataForm.isValidPic" :label="true">是</el-radio>
            <el-radio v-if="type === 2" v-model="dataForm.isValidPic" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item v-if="!dataForm.isValidPic" label="人工ACR分数:">
            <el-input v-if="type === 3" disabled v-model="dataForm.artiAcrTotalScore" type="text" />
            <el-input v-if="type === 2" @change="getScore" v-model="dataForm.artiAcrTotalScore" type="text" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="人工ACR评级:">
            <el-input type="text" v-model="peopleScore" disabled></el-input>
          </el-form-item>
          <el-form-item label="人工TI评级:">
            <el-input v-if="type === 3" disabled v-model="dataForm.artiTiRads" type="text" placeholder="请输入" />
            <el-input v-if="type === 2" v-model="dataForm.artiTiRads" type="text" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="OCR是否影响评级:" label-width="160px">
            <el-radio v-if="type === 3" disabled v-model="dataForm.isOcrAffect" :label="true">是</el-radio>
            <el-radio v-if="type === 3" disabled v-model="dataForm.isOcrAffect" :label="false">否</el-radio>
            <el-radio v-if="type === 2" v-model="dataForm.isOcrAffect" :label="true">是</el-radio>
            <el-radio v-if="type === 2" v-model="dataForm.isOcrAffect" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item label="人工是否核保通过:" label-width="140px">
            <el-radio disabled v-model="dataForm.isArtificialPass" :label="true">是</el-radio>
            <el-radio disabled v-model="dataForm.isArtificialPass" :label="false">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="type !== 3" style="text-align: center;margin: 20px 0">
        <el-button v-permission="['securitybrain:score/submit']" type="primary" @click="sumbit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Safe from '@/api/safe/dataValidation'
export default {
  name: 'data-score',
  data () {
    return {
      id: '',
      type: '',
      peopleScore: '',
      dataForm: {
        isValidPic: ''
      }
    }
  },
  created () {
    const id = this.$route.query.id
    const type = this.$route.query.type
    this.type = parseInt(type)
    this.id = id
    if (id) {
      this.getDetail(id)
    }
  },
  methods: {
    getDetail (id) {
      const params = {
        id: id
      }
      Safe.info(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.setScore(data)
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setScore (data) {
      if (data.artiAcrTotalScore === 0 || data.artiAcrTotalScore === 1) {
        this.peopleScore = 'TR1'
        data.isArtificialPass = true
      } else if (data.artiAcrTotalScore === 2) {
        this.peopleScore = 'TR2'
        data.isArtificialPass = true
      } else if (data.artiAcrTotalScore === 3) {
        this.peopleScore = 'TR3'
        data.isArtificialPass = true
      } else if (data.artiAcrTotalScore > 3 && data.artiAcrTotalScore < 7) {
        this.peopleScore = 'TR4'
        data.isArtificialPass = false
      } else if (data.artiAcrTotalScore > 7 || data.artiAcrTotalScore === 7) {
        this.peopleScore = 'TR5'
        data.isArtificialPass = false
      } else if (data.artiAcrTotalScore === -1) {
        this.peopleScore = ''
        data.isArtificialPass = true
      } else {
        this.peopleScore = ''
        data.isArtificialPass = ''
      }
      if (data.isValidPic === null) {
        data.isValidPic = false
      }
      this.dataForm = data
    },
    getScore (item) {
      const that = this
      that.dataForm.artiAcrTotalScore = parseInt(that.dataForm.artiAcrTotalScore)
      if (typeof (that.dataForm.artiAcrTotalScore) === 'string') {
        that.peopleScore = ''
        that.dataForm.isArtificialPass = ''
      } else if (that.dataForm.artiAcrTotalScore === 0 || that.dataForm.artiAcrTotalScore === 1) {
        that.peopleScore = 'TR1'
        that.dataForm.isArtificialPass = true
      } else if (that.dataForm.artiAcrTotalScore === 2) {
        that.peopleScore = 'TR2'
        that.dataForm.isArtificialPass = true
      } else if (that.dataForm.artiAcrTotalScore === 3) {
        that.peopleScore = 'TR3'
        that.dataForm.isArtificialPass = true
      } else if (that.dataForm.artiAcrTotalScore > 3 && that.dataForm.artiAcrTotalScore < 7) {
        that.peopleScore = 'TR4'
        that.dataForm.isArtificialPass = false
      } else if (that.dataForm.artiAcrTotalScore > 7 || that.dataForm.artiAcrTotalScore === 7) {
        that.peopleScore = 'TR5'
        that.dataForm.isArtificialPass = false
      } else if (that.dataForm.artiAcrTotalScore === -1) {
        that.peopleScore = ''
        that.dataForm.isArtificialPass = true
      } else if (that.dataForm.artiAcrTotalScore < -1) {
        that.$message({
          type: 'error',
          message: '分数不能小于-1！'
        })
        that.peopleScore = ''
        that.dataForm.isArtificialPass = ''
      } else {
        that.peopleScore = ''
        that.dataForm.isArtificialPass = ''
      }
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if ((!this.dataForm.artiAcrTotalScore && this.dataForm.artiAcrTotalScore !== 0) && this.dataForm.isValidPic === false) {
            this.$message({
              type: 'error',
              message: '请填写人工ACR分数！'
            })
            return false
          }
          if (this.dataForm.artiAcrTotalScore < -1) {
            this.$message({
              type: 'error',
              message: '人工ACR分数不能小于-1！'
            })
            return false
          }
          if (this.dataForm.isOcrAffect !== true && this.dataForm.isOcrAffect !== false && this.dataForm.isValidPic === false) {
            this.$message({
              type: 'error',
              message: '请选择OCR是否影响评级！'
            })
            return false
          }
          const params = {
            id: this.id,
            isValidPic: this.dataForm.isValidPic,
            artiAcrCategory: this.peopleScore,
            artiAcrTotalScore: this.dataForm.artiAcrTotalScore,
            artiTiRads: this.dataForm.artiTiRads,
            isOcrAffect: this.dataForm.isOcrAffect,
            isArtificialPass: this.dataForm.isArtificialPass
          }
          Safe.update(params).then(res => {
            const { code, desc, data } = res.data
            if (code === '0000') {
              console.log(data)
              this.$message({
                message: desc,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$nextTick(() => {
                    this.$router.push({
                      path: 'dataValidation'
                    })
                  })
                }
              })
            } else {
              this.$message.error(desc)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dataScore{
    .el-form-item{
      margin: 0 0 4px 0;
    }
    .img-src{
      width: 100%;
    }
    .item-margin{
      margin: 0 0 22px 0;
    }
  }
</style>
