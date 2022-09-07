<template>
  <div class="login">
    <div class="loginbox"></div>
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
  }
}
</style>
