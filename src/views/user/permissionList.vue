<template>
  <div>
    <el-tree :props="props" :data="permissionList" node-key="id" ref="tree" :default-expand-all="false" @node-click="nodeClick"
      :expand-on-click-node="false"
    >
    <!-- :check-on-click-node="false" -->
    </el-tree>
    <PermissionInfo v-if="EditInfoVisible" ref="PermissionInfo"  @get-data-list="getDataList"/>
  </div>
</template>

<script>
import Permissions from '@/api/user/permission'
import PermissionInfo from '@/components/PermissionEdit/index'
export default {
  data () {
    return {
      permissionList: [],
      checkKeys: [],
      EditInfoVisible: false,
      props: {
        label: 'name',
        children: 'childBossPermission'
      },
      checkAccess: [],
      checkedKeys: []
    }
  },
  components: {
    PermissionInfo
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      Permissions.list().then(res => {
        const { code, desc, data } = res.data
        if (code === '0000') {
          console.log(data)
          this.permissionList = data
        } else {
          this.$message.error(desc)
        }
      })
    },
    nodeClick (data, node) { // 选中子节点或孙子节点，必须选中父节点及祖父节点，取消选中子节点或孙子节点，父节点及祖父节点可以不取消选中；
      console.log(111)
      console.log(node)
      this.EditInfoVisible = true
      this.$nextTick(() => {
        this.$refs.PermissionInfo.init(node.key)
      })
    },
    childNodesChange (node) {
      const that = this
      const len = node.childNodes.length
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = false
        that.childNodesChange(node.childNodes[i])
      }
    },
    parentNodesChange (node) {
      const that = this
      if (node.parent) {
        for (const key in node) {
          if (key === 'parent') {
            node[key].checked = true
            that.parentNodesChange(node[key])
          }
        }
      }
    },
    // 内容区渲染后执行 判断底层 赋 class（底层树横排显示）
    renderContent (h, { node, data, store }) {
      let classname = ''
      if (node.childNodes.length === 0) {
        classname = 'levelname'
      } else {
        classname = 'fatherlevelname'
      }
      return (
        <span class={classname}>
          <span>{node.label}</span>
        </span>
      )
    },
    handleCheckChange (nodeObj, treeObj) {
      this.checkAccess = treeObj.checkedNodes
      this.checkedKeys = treeObj.checkedKeys // 选中节点数组
      this.checkParentId = treeObj.halfCheckedKeys // 选中节点的父节点id
    }
  }
}
</script>

<style>

</style>
