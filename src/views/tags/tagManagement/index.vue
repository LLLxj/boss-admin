<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="打标项目:">
        <el-select v-model="searchData.proId" clearable filterable placeholder="请选择">
          <el-option v-for="item in tagList" :key="item.id" :label="item.proName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型选择:">
        <el-select v-model="searchData.type" @change="getTypeStatus" clearable filterable placeholder="请选择">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="特征:">
        <el-select v-model="searchData.featureId" clearable filterable placeholder="请选择">
          <el-option v-for="item in featureList" :key="item.id" :label="item.featureName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <!-- 1 打分 2 打标签-->
        <el-button v-permission="['label:add']" v-if="searchData.type === 1" :disabled="!searchData.featureId" type="primary" @click="addHandle()">新增标签</el-button>
        <el-button v-permission="['label:add']" v-if="searchData.type === 2" :disabled="!searchData.featureId" type="primary" @click="addHandle()">新增标签</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="12" style="padding: 40px 0">
      <el-col :span="4" v-for="item in list" :key="item.id">
        <el-card shadow="always" style="margin: 10px 0">
          <div class="card-contain">
            <div v-permission="['label:delete']" class="item item-img"><img @click="deleteHandle(item.id)" class="img-src" src="@/assets/images/delete.png" alt=""></div>
            <div v-if="searchData.type === 2" class="item item-bold">{{item.cnName}}</div>
            <div v-if="searchData.type === 1" class="item item-bold">{{item.label}}</div>
            <div class="item">{{item.enName}}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <EditTag ref="EditTag" v-if="editTagVisible" @get-data-list="getDataList" />
  </div>
</template>

<script>
import TagManage from '@/api/tag/tagManage'
import EditTag from './edit'
export default {
  name: 'tags-tagManagement',
  data () {
    return {
      searchData: {
        proId: '',
        type: '',
        featureId: ''
      },
      list: [],
      tagList: [],
      typeList: [
        { label: '打标签', value: 2 },
        { label: '打分', value: 1 }
      ],
      featureList: [],
      editTagVisible: false
    }
  },
  created () {
    // this.getDataList()
    this.getLabelList()
  },
  components: {
    EditTag
  },
  methods: {
    getLabelList () {
      TagManage.labelList().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.tagList = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getDataList () {
      const params = {
        featureId: this.searchData.featureId
      }
      TagManage.list(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.list = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTypeStatus () {
      this.searchData.featureId = ''
      this.featureList = []
      this.getFeatureList()
    },
    getFeatureList () {
      const params = {
        proId: this.searchData.proId,
        type: this.searchData.type
      }
      TagManage.getFeature(params).then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.featureList = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addHandle () {
      this.editTagVisible = true
      const featureId = this.searchData.featureId
      const type = this.searchData.type
      this.$nextTick(() => {
        this.$refs.EditTag.init(featureId, type)
      })
    },
    deleteHandle (id) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: id
        }
        TagManage.delete(params).then(res => {
          const { code, desc } = res.data
          if (code === '0000') {
            this.$message({
              message: desc,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.getDataList()
              }
            })
          } else {
            this.$message.error(desc)
          }
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-contain{
    display: flex;
    justify-content: center;
    flex-direction: column;
    .item{
      text-align: center;
      padding: 10px 0;
      .img-src{
        width: 25px;
        height: 25px;
        cursor: pointer;
      }
      &.item-img{
        text-align: right;
      }
      &.item-bold{
        font-weight: 700;
      }
    }
  }
</style>
