<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-button v-permission="['cms:category/add']" v-if="showAddButton" type="primary" @click="addHandle('parent')">新增一级分类</el-button>
      <span v-else>全部内容</span>
    </div>
    <!-- <el-tree :data="dataList" :props="defaultProps" v-loading="loading" @node-click="handleNodeClick" @current-change="currentChange"
    @node-contextmenu="oncontextmenu" highlight-current default-expand-all :expand-on-click-node="false" style="height:70vh;overflow:auto">
    </el-tree> -->
    <el-tree
      :data="dataList"
      :props="defaultProps"
      @current-change="currentChange"
      @node-contextmenu="oncontextmenu"
      :expand-on-click-node="false"
      v-loading="loading"
      highlight-current
      default-expand-all
      style="height:70vh;overflow:auto">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="margin-left" v-if="data.parentId === 0">
            <el-button type="text" size="mini" @click="() => addChild(data)">新增子分类</el-button>
          </span>
        </span>
    </el-tree>
  </el-card>
</template>

<script>
import CmsContent from '@/api/cms/content'
import CheckPermission from '@/utils/permissions'
export default {
  data () {
    return {
      loading: false,
      dataList: [],
      defaultProps: {
        children: 'childrens',
        label: 'name'
      }
    }
  },
  props: {
    showAddButton: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (CheckPermission.hasPermission('cms:category/list')) {
      this.getDataList()
    }
  },
  methods: {
    init () {
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      CmsContent.categoryList().then(res => {
        this.loading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.dataList = []
          this.dataList = data
          this.setInitData()
        } else {
          this.$message.error(desc)
        }
      })
    },
    setInitData () {
      if (this.showAddButton) { // 内容管理
        this.dataList.forEach((item, index) => {
          if (index === 0) {
            this.currentChange(item)
          }
        })
      } else { // 分类管理
        this.dataList.forEach((item, index) => {
          if (index === 0) {
            if (item.childrens && item.childrens.length) {
              item.childrens.forEach((chiItem, chiIndex) => {
                if (chiIndex === 0) {
                  this.currentChange(chiItem)
                }
              })
            }
          }
        })
      }
    },
    // handleNodeClick (item) {
    //   console.log('handleNodeClick')
    //   console.log(item)
    // },
    currentChange (item) {
      this.$emit('get-code-value', item)
    },
    addChild (item) {
      this.addHandle('children', item)
    },
    addHandle (type, item) {
      this.$emit('add-handle', type, item)
    },
    oncontextmenu (event, data, node) {
      // console.log('oncontextmenu')
      // console.log(event)
      // console.log(data)
      // console.log(node)
    }
  }
}
</script>

<style lang="scss" scoped>
  .margin-left {
    margin: 0 0 0 40px;
  }
</style>
