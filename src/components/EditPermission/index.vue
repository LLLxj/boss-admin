<template>
  <el-dialog title="修改权限" :visible.sync="visible" :close-on-click-modal="false" width="800px">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="选择权限:">
        <el-tree
          :props="props"
          :data="permissionList"
          show-checkbox
          node-key="id"
          ref="tree2"
          :default-expand-all="false"
          :render-content="renderContent"
          :check-on-click-node="true"
          :check-strictly="true"
          :default-checked-keys="checkKeys"
          @node-click="nodeClick"
          :expand-on-click-node="false"
          @check="handleCheckChange"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Roles from '@/api/user/role'
import CheckPermission from '@/utils/permissions'

export default {
  data () {
    return {
      dataForm: {
        adminList: [],
        unAdminList: []
      },
      permissionList: [],
      selectList: [],
      adminList: [],
      unAdminList: [],
      id: '',
      props: {
        label: 'name',
        children: 'childBossPermission'
      },
      checkKeys: [], // 默认选中节点
      visible: false,
      changeFlag: 0, // 是否更改权限
      checkedKeys: [], // 最终提交的节点
      checkId: '',
      checkedParentId: ''
    }
  },
  methods: {
    init (id) {
      this.visible = true
      if (CheckPermission.hasPermission('permission:list')) {
        this.roleList()
      }
      if (id) {
        this.id = id
      }
    },
    async roleList () {
      const result = await Roles.permissionList()
      const { code, data, desc } = result.data
      if (code === '0000') {
        this.permissionList = data
        this.getInfo()
      } else {
        this.$message.error(desc)
      }
    },
    getInfo () {
      const params = {
        roleId: this.id
      }
      Roles.info(params).then(res => {
        const { code, data, desc } = res.data
        if (code === '0000') {
          this.checkKeys = []
          data.forEach(item => {
            this.checkKeys.push(item.id)
          })
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err)
      })
    },
    resetForm () {
      // this.$nextTick(() => {
      this.$refs.dataForm.resetFields()
      // })
    },
    handleAdmin (item) {
      console.log(item)
    },
    handleUnadmin (item) {
      console.log(item)
    },
    nodeClick (data, node) { // 选中子节点或孙子节点，必须选中父节点及祖父节点，取消选中子节点或孙子节点，父节点及祖父节点可以不取消选中；
      this.childNodesChange(node)
      this.parentNodesChange(node)
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
      this.changeFlag = 1
      this.checkAccess = treeObj.checkedNodes
      this.checkedKeys = treeObj.checkedKeys // 选中节点数组
      this.checkParentId = treeObj.halfCheckedKeys // 选中节点的父节点id
    },
    sumbit () {
      const ids = this.checkedKeys.join(',')
      const params = {
        roleId: this.id,
        permissions: ids
      }
      Roles.update(params).then(res => {
        const { code, desc } = res.data
        if (code === '0000') {
          this.$message({
            message: desc,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
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
    },
    cancle () {
      this.visible = false
      this.resetForm()
    }
  }
}
</script>

<style>

</style>
