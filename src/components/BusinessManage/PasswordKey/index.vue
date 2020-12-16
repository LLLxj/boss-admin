<template>
  <div>
    <div style="padding: 0 0 10px 0">
      <el-button v-permission="['mer:key/add']" type="primary" @click.stop="editHandle()">添加密钥</el-button>
    </div>
    <div v-if="list && list.length">
      <el-card v-for="(item, index) in list" :key="item.id" class="box-card box-margin">
        <div slot="header" class="clearfix">
          <span>key:{{item.secretKey}}</span>
          <el-button v-permission="['mer:key/update']" style="float: right; padding: 3px 0" type="text" @click="editHandle(item)">编辑</el-button>
        </div>
        <el-form :model="item" ref="dataForm" label-width="60px">
          <el-form-item label="公钥:" prop="publicKey">
            <div class="row">
              <el-input type="text" v-model="item.publicKey" disabled></el-input>
              <el-button class="button-margin" :id="'publicKey' + index " :data-clipboard-text="item.publicKey" @click="copyHandle('#publicKey' + index)" type="primary">复制</el-button>
            </div>
          </el-form-item>
          <el-form-item label="私钥:" prop="privateKey">
            <div class="row">
              <el-input type="text" v-model="item.privateKey" disabled></el-input>
              <el-button class="button-margin" :id="'privateKey' + index" :data-clipboard-text="item.privateKey" @click="copyHandle('#privateKey' + index)" type="primary">复制</el-button>
            </div>
          </el-form-item>
          <el-form-item label="有效期:" prop="privateKey">
            <span v-text="item.expireTimeDesc" class="right-margin"></span>
            <el-tag v-if="item.status === 1">正常</el-tag>
            <el-tag v-if="item.status === 2" type="info">失效</el-tag>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <PasswordKeyEdit v-if="passwordKeyVisible" ref="PasswordKeyEdit" @get-data-list="getInfo" />
  </div>
</template>

<script>
import Business from '@/api/businessManage/business'
import Clipboard from 'clipboard'
import PasswordKeyEdit from '@/components/BusinessManage/PasswordkeyEdit/'

export default {
  name: 'password-key',
  data () {
    return {
      listLoading: false,
      list: [],
      id: '',
      passwordKeyVisible: false
    }
  },
  components: {
    PasswordKeyEdit
  },
  methods: {
    init (id) {
      this.id = id
      this.getInfo()
    },
    getInfo () {
      const params = {
        merId: this.id
      }
      this.listLoading = true
      Business.keyList(params).then(res => {
        this.listLoading = false
        const { code, desc, data } = res.data
        if (code === '0000') {
          this.list = data
        } else {
          this.$message.error(desc)
        }
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    copyHandle (item) {
      var clipboard = new Clipboard(item)
      clipboard.on('success', e => {
        this.$message({
          showClose: true,
          message: '复制成功！',
          type: 'success'
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          showClose: true,
          message: '该浏览器不支持自动复制！',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    editHandle (item) {
      this.passwordKeyVisible = true
      this.$nextTick(() => {
        this.$refs.PasswordKeyEdit.init(item, this.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-style{
    width: 100%;
    padding: 30px;
  }
  .box-margin{
    margin: 10px 0 0 0;
  }
  .right-margin{
    margin: 0 30px 0 0;
  }
  .row{
    display: flex;
    .button-margin{
      margin: 0 0 0 10px;
    }
  }
</style>
