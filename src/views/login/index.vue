<template>
  <div class="login-container">
    <div class="login_box" id="login_box">
      <div class="login_bj">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
          <el-form-item prop="account">
            <el-input v-model="ruleForm.account" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="ruleForm.pwd" type="password" placeholder="请输入密码" @keyup.enter.native="onSubmit('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item prop="captcha" v-if="isVerification">
            <div class="verification clear">
              <el-input type="text" placeholder="请输入验证码" v-model="captcha" @keyup.enter.native="onSubmit('ruleForm')"></el-input>
              <img v-bind:src="img" alt="" @click="authCaptcha">
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="login_but" @click="onSubmit('ruleForm')">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">vue-element-admin</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="password"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div>
    </el-form> -->
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
// import System from '@/api/login'
// import { setToken } from '@/utils/auth'

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
        pwd: ''
      },
      isVerification: false,
      loginForm: {
        username: '哈士奇',
        password: '123456'
      },
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
      this.$refs.loginForm.validate(valid => {
        if (valid) {
        //   this.loading = true
        //   System.login(this.loginForm).then(({ data }) => {
        //     const { code, msg, result } = data
        //     if (code === 200) {
        //       this.$message.success(msg)
        //       setToken(result)
        //       this.$router.push({ path: this.redirect || '/' })
        //       this.$store.dispatch('Login', result)
        //     } else {
        //       this.loading = false
        //       this.$message({
        //         message: msg,
        //         type: 'error',
        //         duration: 1500
        //       })
        //     }
        //   }).catch(() => {
        //     this.loading = false
        //   })
        // } else {
        //   console.log('error submit!!')
        //   return false
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
