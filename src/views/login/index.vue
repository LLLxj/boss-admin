<template>
  <div class="login-container">
    <div class="login_box" id="login_box">
      <div class="login_bj">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
          <el-form-item prop="account">
            <el-input v-model="ruleForm.account" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="ruleForm.pwd" type="password" placeholder="请输入密码" @keyup.enter.native="handleLogin()"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="captcha" v-if="isVerification">
            <div class="verification clear">
              <el-input type="text" placeholder="请输入验证码" v-model="captcha" @keyup.enter.native="onSubmit('ruleForm')"></el-input>
              <img v-bind:src="img" alt="" @click="authCaptcha">
            </div>
          </el-form-item> -->
          <el-form-item>
            <el-button class="login_but" @click="handleLogin()">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import System from '@/api/login'
import { setToken } from '@/utils/auth'
import md5 from 'js-md5'
export default {
  name: 'login',
  data () {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePass = (rule, value, callback) => {
    //   if (value.length < 5) {
    //     callback(new Error('密码不能小于5位'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      ruleForm: {
        account: '',
        pwd: '',
        captcha: '',
        captchaToken: ''
      },
      isVerification: false,
      rules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.ruleForm.pwd = md5(this.ruleForm.pwd)
          System.login(this.ruleForm).then(res => {
            const { code, desc, data } = res.data
            if (code === '0000') {
              setToken(data.token)
              const tempList = []
              data.menuList.forEach(item => {
                if (item.childBossPermission && item.childBossPermission.length) {
                  item.childBossPermission.forEach(chiItem => {
                    if (chiItem.permission) {
                      tempList.push(chiItem.permission)
                    }
                  })
                }
              })
              this.$router.push({ path: this.redirect || '/' })
              this.$store.dispatch('Login', data.token)
            } else {
              this.loading = false
              this.$message({
                message: desc,
                type: 'error',
                duration: 1500
              })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  background: url('../../assets/images/timg.png') no-repeat;
  background-size: 100%;
  width: 100%;
  height: 100vh;
  .login_box{
    margin: 0 auto;
    width: 500px;
    .login_bj {
      width: 400px;
      background-color: #fff;
      padding: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -193px 0 0 -250px;
      input {
        display: block;
        width: 100%;
        height: 46px;
        line-height: 46px;
        border: 1px #1763A6 solid;
        border-radius: 2px;
        padding-left: 4%;
        font-size: 14px;
        margin-top: 20px;
      }
    }
    .verification{
      font-size: 14px;
      margin-top: 20px;
      img{
        width: 120px;
        float:right;
        height: 46px;
        cursor: pointer;
      }
    }
  }
  .login_but {
    display: block;
    background: #1763A6;
    width: 100%;
    font-size: 20px;
    color: #fff;
    margin-top: 30px;
  }
}
</style>
