<template>
  <div class="wrap">
    <div class="highColor">用户{{activityRecord.nickName}}的推荐详情</div>
    <div class="row">推荐用户</div>
    <div class="row">
      <div v-for="item in recommendInfo.list" :key="item.id" class="list">
        <img :src="item.headUrl" alt="" class="img-src">
        <div class="user-name">{{item.name}}</div>
      </div>
    </div>
    <div class="row">
      收货信息：
    </div>
    <div class="row">
      姓名：{{addressInfo.name}}
    </div>
    <div class="row">
      电话：{{addressInfo.phoneNo}}
    </div>
    <div class="row">
      地址：{{addressInfo.address}}
    </div>
    <div v-if="activityRecord.status == 0" class="row">物流状态：未发货</div>
    <div v-if="activityRecord.status == 1" class="row">物流信息：</div>
    <div v-if="activityRecord.status == 1" class="row">快递信息：{{activityRecord.logisticsCompany}}-{{activityRecord.logisticsOrder}}</div>

    <el-button v-permission="['mask:sendgoods']" type="primary" v-if="activityRecord.isAddress !== 0 && activityRecord.status === 0" @click="toSend()">去发货</el-button>
    <el-button v-permission="['mask:sendgoods']" type="primary" v-if="activityRecord.status == 1" @click="deleteHandle()">删除</el-button>
    <!--发货-->
    <el-dialog title="发货" :visible.sync="visible" :close-on-click-modal="false" width="600px">
      <el-form :model="dataForm" ref="dataForm" :rules="formRules" label-width="120px">
        <el-form-item label="快递公司:" prop="logisticsCompany">
          <el-input type="text" v-model="dataForm.logisticsCompany" placeholder="请输入快递公司"></el-input>
        </el-form-item>
        <el-form-item label="快递单号:" prop="logisticsOrder">
          <el-input type="text" v-model="dataForm.logisticsOrder" placeholder="请输入快递单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="sumbit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Mask from '@/api/activities/mask'
export default {
  name: '',
  data () {
    return {
      activityRecord: {},
      recommendInfo: {},
      addressInfo: {},
      userList: [],
      dataForm: {
        logisticsCompany: '',
        logisticsOrder: ''
      },
      id: '',
      visible: false,
      formRules: {
        logisticsCompany: [
          { required: true, message: '快递公司不能为空', trigger: 'blur' }
        ],
        logisticsOrder: [
          { required: true, message: '快递单号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const id = this.$route.query.id
    if (id) {
      this.id = id
      this.getInfo(id)
    }
  },
  methods: {
    getInfo (id) {
      Mask.info({ id: id }).then(res => {
        const { code, data, desc } = res.data
        if (code === '0000') {
          this.detail = data
          this.activityRecord = data.activityRecord
          this.recommendInfo = data.recommendInfo
          this.addressInfo = data.addressInfo
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.$message.error(err)
        console.log(err)
      })
    },
    toSend () {
      this.visible = true
    },
    cancle () {
      this.visible = false
      this.resetForm()
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    deleteHandle () {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempObj = { // 默认删除参数
          id: this.id,
          logisticsCompany: '',
          logisticsOrder: ''
        }
        Mask.sendGoods(tempObj).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            this.$router.push({ name: 'activities-mask' })
          } else {
            this.$message.error(desc)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      })
    },
    sumbit () {
      const tempObj = { // 默认删除参数
        id: this.id,
        logisticsCompany: this.dataForm.logisticsCompany,
        logisticsOrder: this.dataForm.logisticsOrder
      }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          Mask.sendGoods(tempObj).then(res => {
            const { code, desc } = res.data
            if (code === '0000') {
              this.$message({
                message: desc,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$router.push({
                    name: 'activities-mask'
                  })
                }
              })
            } else {
              this.$message.error(desc)
            }
          }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .wrap {
    padding: 20px 40px;
    .highColor{
      color: #409EFF;
    }
    .row{
      display: flex;
      margin: 15px 0;
      .list{
        width: 80px;
        margin: 0 0 0 15px;
        font-size: 0;
        .img-src{
          width: 100%;
          border-radius: 50%;
        }
        .user-name{
          font-size: 14px;
          margin: 10px 0 0 0;
          text-align: center;
        }
      }
    }
  }
</style>
