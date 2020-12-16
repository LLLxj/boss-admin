<template>
  <div class="count">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form :model="searchData" :inline="true" ref="searchData" label-width="80px">
          <el-form-item label="商户名称">
            <el-select v-model="searchData.merId" @change="getStatus" clearable filterable placeholder="请选择商户名称">
              <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24" v-if="showBasicData">
      <div class="show-datas">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>测评统计</span>
          </div>
          <el-row :gutter="24" class="panel-group">
            <el-col :span="8" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-description">
                  <div class="card-panel-text">上周</div>
                  <count-to :start-val="0" :end-val="basciInfo.lastWeek" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
              <!-- <span class="button dataTitle">上周</span> -->
            </el-col>
            <el-col :span="8" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-description">
                  <div class="card-panel-text">上月</div>
                  <count-to :start-val="0" :end-val="basciInfo.lastMonth" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
              <!-- <span class="button dataTitle">上月</span> -->
            </el-col>
            <el-col :span="8" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-description">
                  <div class="card-panel-text">近半年</div>
                  <count-to :start-val="0" :end-val="basciInfo.lastHalfYear" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
              <!-- <span class="button dataTitle">近半年</span> -->
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-row>
    <el-row :gutter="24" v-if="showBasicData">
      <div class="show-datas">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据统计</span>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane v-for="item in dataRange" :key="item.value" :name="item.label" :label="item.label" />
            </el-tabs>
          </div>
          <el-row :gutter="24" class="panel-group">
            <el-col :span="12" v-if="xAxis && xAxis.length">
              <BarChart :width="1000 + 'px'" :xAxis="xAxis" :series="series"/>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-row>
  </div>
</template>

<script>
import Count from '@/api/businessManage/count'
import CheckPermission from '@/utils/permissions'
import MeasureSearch from '@/api/statistics/measureSearch'
import CountTo from 'vue-count-to'
import BarChart from '@/components/BarChart'

require('echarts/theme/macarons') // echarts theme

export default {
  name: 'statistics-policyQuery',
  data () {
    return {
      searchData: {
        merId: ''
      },
      xAxis: [],
      series: [],
      className: 'chart',
      dataRange: [
        { label: '按月', value: 1, permission: 'merstatistics:weekinfo' },
        { label: '按周', value: 2, permission: 'merstatistics:monthinfo' }
      ],
      basciInfo: { // 基本信息
        lastWeek: 0,
        lastMonth: 0,
        lastHalfYear: 0
      },
      activeName: '',
      showBasicData: false,
      listLoading: false,
      storeList: [],
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    CountTo, BarChart
  },
  mounted () {
    if (CheckPermission.hasPermission('pf:list')) {
      this.getStoreList()
    }
  },
  methods: {
    getStoreList () {
      this.listLoading = true
      MeasureSearch.storeList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.listLoading = false
          this.storeList = data
        } else {
          this.listLoading = false
          this.$message({
            message: desc,
            type: 'error',
            duration: 1500
          })
        }
      }).catch(err => {
        this.listLoading = false
        console.log(err)
        this.$message({
          message: err || '读取接口失败！',
          type: 'error',
          duration: 1500
        })
      })
    },
    getStatus (item) {
      this.searchData.merId = item
      if (CheckPermission.hasPermission('merstatistics:baseinfo')) { // 获取基本统计信息
        this.getBasicInfo()
      }
      this.dataRange = CheckPermission.checkPermissionList(this.dataRange)
      this.activeName = this.dataRange[0].label
      if (CheckPermission.hasPermission('merstatistics:weekinfo')) { // 获取周统计信息
        if (this.activeName === '按周') {
          this.getWeekInfo()
        }
      }
      if (CheckPermission.hasPermission('merstatistics:monthinfo')) { // 获取月统计信息
        if (this.activeName === '按月') {
          this.getMonthInfo()
        }
      }
    },
    handleClick (item) {
      this.activeName = item.name
      if (this.activeName === '按周') {
        this.getWeekInfo()
      } else if (this.activeName === '按月') {
        this.getMonthInfo()
      }
    },
    getBasicInfo () { // 基本统计信息
      console.log('基本统计信息')
      Count.basicInfo(this.searchData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          this.showBasicData = true
          this.basciInfo = data
          // this.basciInfo = { // 基本信息
          //   lastWeek: 100,
          //   lastMonth: 200,
          //   lastHalfYear: 300
          // }
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getWeekInfo () { // 周统计信息
      // console.log('周统计信息')
      Count.weekInfo(this.searchData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.xAxis = []
          this.series = []
          this.xAxis = data.xAxis
          this.series = data.series
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getMonthInfo () { // 月统计信息
      // console.log('月统计信息')
      Count.monthInfo(this.searchData).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.xAxis = []
          this.series = []
          this.xAxis = data.xAxis
          this.series = data.series
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .count{
    .row{
      text-align:right;
      color: #aaa;
      font-size: 18px;
      padding: 20px 0;
    }
    .show-datas{
      padding: 20px;
    }
    .panel-group {
      margin-top: 18px;
      .card-panel-col{
      }
      .card-panel {
        height: 108px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .15);
        border-color: rgba(0, 0, 0, .05);
        .icon-people {
          color: #40c9c6;
        }
        .icon-message {
          color: #36a3f7;
        }
        .icon-money {
          color: #f4516c;
        }
        .icon-shoppingCard {
          color: #34bfa3
        }
        .card-panel-icon-wrapper {
          float: left;
          margin: 14px 0 0 14px;
          padding: 16px;
          transition: all 0.38s ease-out;
          border-radius: 6px;
        }
        .card-panel-icon {
          float: left;
          font-size: 48px;
        }
        .card-panel-description {
          width:100%;
          text-align: center;
          font-weight: bold;
          margin: 26px;
          margin-left: 0px;
          .card-panel-text {
            width:100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            line-height: 18px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 16px;
            margin-bottom: 12px;
          }
          .card-panel-num {
            font-size: 20px;
            color:red;
          }
        }
      }
    }
  }
</style>
