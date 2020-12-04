<template>
  <el-dialog title="创建用户" :visible.sync="visible" :close-on-click-modal="false" width="800px">
    <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px">
      <el-form-item label="账号:" prop="account">
        <el-input type="text" v-model="dataForm.account" placeholder="请输入非中文账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input type="text" v-model="dataForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input type="text" v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号码:" prop="phone">
        <el-input type="text" v-model="dataForm.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="pwd">
        <el-input type="password" v-model="dataForm.pwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="选择角色">
        <el-form-item label="管理员:" prop="adminList">
          <el-checkbox-group v-model="dataForm.adminList" @change="handleAdmin">
            <el-checkbox v-for="item in adminList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="非管理员:" prop="unAdminList">
          <el-checkbox-group v-model="dataForm.unAdminList" @change="handleUnadmin">
            <el-checkbox v-for="item in unAdminList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="sumbit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import User from '@/api/user/user'
import md5 from 'js-md5'
import { validateEmails, validatePhone, validatePassword } from '@/utils/validate'
export default {
  data () {
    var validateEmail = (rule, value, callback) => {
      if (!validateEmails(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validatePhones = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    }
    var validatePas = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error('请输入6-16位字母、数字、下划线组合'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        adminList: [],
        unAdminList: [],
        account: '',
        name: '',
        email: ''
      },
      selectList: [],
      adminList: [],
      unAdminList: [],
      id: '',
      // 表单验证规则
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'change' }
        ],
        phone: [
          // { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatePhones, trigger: 'change' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePas, trigger: 'blur' }
        ]
      },
      visible: false
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.roleListAll()
      if (id) {
        this.id = id
      }
    },
    async roleListAll () {
      const result = await User.roleListAll()
      const { code, data, desc } = result.data
      if (code === '0000') {
        this.adminList = data.filter(item => item.isAdmin)
        this.unAdminList = data.filter(item => !item.isAdmin)
        // this.getInfo()
      } else {
        this.$message.error(desc)
      }
    },
    getInfo () {
      const params = {
        userId: this.id
      }
      User.userRoleList(params).then(res => {
        const { code, data, desc } = res.data
        if (code === '0000') {
          this.selectList = []
          this.dataForm.adminList = []
          this.dataForm.unAdminList = []
          const adminList = data.filter(item => item.isAdmin)
          const unAdminList = data.filter(item => !item.isAdmin)
          adminList.forEach(item => {
            this.dataForm.adminList.push(item.id)
          })
          unAdminList.forEach(item => {
            this.dataForm.unAdminList.push(item.id)
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
    sumbit () {
      this.$refs.dataForm.validate((valid) => {
        const checkAll = [...this.dataForm.adminList, ...this.dataForm.unAdminList]
        var ids = ''
        checkAll.forEach(item => {
          ids += item + ','
        })
        ids = ids.substr(0, ids.length - 1)
        const params = {
          account: this.dataForm.account,
          name: this.dataForm.name,
          email: this.dataForm.email,
          phone: this.dataForm.phone,
          pwd: md5(this.dataForm.pwd),
          roleIds: ids
        }
        User.save(params).then(res => {
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
