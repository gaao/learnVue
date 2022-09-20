<template>
  <div class="login">
    <div class="loginbox">
      <!-- 头像区域 -->
      <div class="avatarbox">
        <img src="../assets/img/logo_red.png" alt="logo">
        <div class="username"></div>
        <div class="password"></div>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFromRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"
            suffix-icon="iconfont icon-showpassword"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" @keyup.enter="login">登录</el-button>
          <el-button type="info" @click="reset('loginFromRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'

      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置
    reset(data) {
      console.log('data=====', data)
      console.log('this-', this)
      this.$refs[data].resetFields()
    },
    login() {
      this.$refs.loginFromRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) { return false }
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          // return console.log('登陆失败')
          return this.$message({
            message: res.meta.msg,
            type: 'warning'
          })
        } else {
          return {
            msg: this.$message.success(res.meta.msg),
            tok: window.sessionStorage.setItem('token', res.data.token),
            path: this.$router.push('/home')
          }
        }
      })
    }

  }

}
</script>

<style lang="less" scoped>
.login {
  background-color: rgb(19, 25, 30);
  height: 100%;

  .loginbox {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatarbox {
      width: 130px;
      height: 130px;
      padding: 0.5em;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.08);
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
