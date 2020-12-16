<template>
  <el-dialog :title="dataForm.id ? '编辑服务' : '新增服务'" :visible.sync="visible" :close-on-click-modal="false" :before-close="cancle">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="服务名称:" prop="serviceId">
        <el-select v-if="!dataForm.id" v-model="dataForm.serviceId" clearable placeholder="请选择">
          <el-option v-for="item in serviceList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-input v-if="dataForm.id" v-model="dataForm.serviceName" disabled></el-input>
      </el-form-item>
      <el-form-item label="服务类型:">
        <el-select v-model="dataForm.serviceType" @change="getStatus" placeholder="请选择">
          <el-option v-for="item in serviceTypeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期:">
        <el-date-picker v-model="dataForm.time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="次数:">
        <el-input-number v-model="dataForm.totalNum" :min="0" :disabled="dataForm.serviceType === 1" :max="1000" label="服务次数"></el-input-number>
        <!-- <el-input v-if="serviceDetail.serviceType == 1" disabled="disabled" v-model="serviceDetail.totalNum" placeholder=""></el-input> -->
        <!-- <el-input v-if="serviceDetail.serviceType == 3" v-model="serviceDetail.totalNum" placeholder="请输入服务次数"></el-input> -->
      </el-form-item>
      <el-form-item label="状态:" prop="status">
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
  name: 'service-edit',
  data () {
    return {
      dataForm: {
        id: '',
        merId: '',
        serviceId: '',
        serviceType: '',
        time: [],
        startTimeDesc: '',
        endTimeDesc: '',
        totalNum: '',
        status: 1
      },
      id: '',
      serviceList: [],
      statusList: [
        { label: '激活', value: 1 },
        { label: '失效', value: 2 }
      ],
      serviceTypeList: [
        { label: '时间（不限次）', value: 1 },
        { label: '时间+次数（限次）', value: 3 }
      ],
      visible: false
    }
  },
  methods: {
    init (item, merId) {
      console.log(item)
      this.visible = true
      if (item) {
        this.dataForm = {
          id: item.id,
          merId: merId,
          serviceId: item.id,
          serviceType: item.serviceType,
          serviceName: item.serviceName,
          time: [item.startTimeStr, item.endTimeStr],
          startTimeDesc: item.startTimeStr,
          endTimeDesc: item.endTimeStr,
          totalNum: item.totalNum ? item.totalNum : undefined,
          status: item.status
        }
      } else {
        this.resetForm()
        this.dataForm = {
          id: '',
          merId: merId,
          serviceId: '',
          serviceType: '',
          serviceName: '',
          time: [],
          startTimeDesc: '',
          endTimeDesc: '',
          totalNum: undefined,
          status: 1
        }
      }
      this.getServiceList()
    },
    getStatus (item) {
      if (item === 1) {
        this.dataForm.totalNum = undefined
      }
    },
    getServiceList () {
      Business.selectServiceList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.serviceList = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    resetForm () {
      console.log(1112222)
      this.$refs.dataForm.resetFields()
    },
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.dataForm.id,
            merId: this.dataForm.merId,
            serviceId: this.dataForm.serviceId,
            serviceType: this.dataForm.serviceType,
            startTimeDesc: this.dataForm.time[0],
            endTimeDesc: this.dataForm.time[1],
            totalNum: this.dataForm.totalNum,
            status: this.dataForm.status
          }
          if (this.dataForm.id) {
            Business.updateService(params).then(res => {
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
          } else {
            Business.saveService(params).then(res => {
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
        }
      })
    },
    cancle () {
      console.log(1111)
      this.visible = false
      this.resetForm()
    }
  }
}
</script>

<style>

</style>
