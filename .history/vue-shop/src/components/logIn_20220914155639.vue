<template>
  <div class="login">
    <div class="loginbox">
      <!-- 头像区域 -->
      <div class="avatarbox">
        <img src="../assets/logo.png" alt="logo">
        <div class="username"></div>
        <div class="password"></div>
      </div>
      <!-- 登录表单区域 -->
      <el-form >
        <el-form-item label="用户名 ">
          <el-input ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

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
  }
}
</style>
