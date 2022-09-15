<template>
  <div class="login">
    <div class="loginbox">
      <div class="avatarbox">
        <img src="../assets/logo.png" alt="logo">
        <div class="username"></div>
        <div class="password"></div>
      </div>
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
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 30px 0 #eee;
 
      img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background-color:#eee;
      }
    }
  }
}
</style>
