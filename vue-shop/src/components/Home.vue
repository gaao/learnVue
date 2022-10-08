<template>
  <el-container class="homepage">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/logo_white.png" alt="logo">
        <span>保险产品后台管理系统</span>
      </div>
      <el-button size="mini" type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu class="menu" background-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false"
          router :default-active="activeIndex">
          <el-submenu v-for="item in menulist" :index="item.id + ''" :key="item.id">
            <template slot="title">
              <i :class="iconobj[item.id]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
              @click="menuActive('/' + subitem.path)">
              <!-- <i class="el-icon-location"></i> -->
              <span slot="title">{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 开关 -->
        <div class="toggle-button" @click="toggleCollapse">
          <i v-if="isCollapse" class="el-icon-s-unfold"></i>
          <i v-else class="el-icon-s-fold"></i>
          <span v-show="!isCollapse">收起菜单</span>
        </div>
      </el-aside>
      <!-- 主内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import _ from 'lodash'

export default {
  data() {
    return {
      menulist: [],
      iconobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeIndex: ''
    }
  },
  created() {
    this.getMenuList()
    this.activeIndex = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 深拷贝
      const menu = _.cloneDeep(res.data)
      console.log('menu', menu)
      for (const key in menu) {
        if (menu[key].authName === '商品管理') {
          menu[key].authName = '产品管理'
        }
      }
      for (let i = 0; i < menu.length; i++) {
        menu[i].children.map((value, index) => {
          if (value.authName === '商品列表') {
            menu[i].children[index].authName = '产品列表'
          } else if (value.authName === '商品分类') {
            menu[i].children[index].authName = '产品分类'
          }
          console.log(121212, menu)
          return menu
        })
      }

      // 处理
      this.menulist = menu
      // this.menulist = res.data
      console.log('menulist', this.menulist)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    menuActive(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activeIndex = path
    }
  }
}
</script>
<style lang="less" scoped>
.homepage {
  height: 100%;
}

.el-header {
  background-color: rgb(38, 41, 44);
  display: flex;
  justify-content: space-between;
  align-items: center;

  >div {
    display: flex;
    align-items: center;

    img {
      width: 52.36px;
      height: 36px;
    }

    span {
      font-size: 20px;
      margin-left: 16px;
      color: #fff;
    }
  }
}

.el-aside {
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .toggle-button {
    background-color: rgb(245, 245, 245);
    color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    bottom: 0;
    cursor: pointer;

    span {
      // font-size: 14px;
      margin-left: 8px;
    }
  }

  .el-menu {
    border-right: none;
  }

  .menu {
    background-color: transparent transparent;

    span {
      margin-left: 8px;
    }
  }
}

.el-main {
  background-color: rgb(237, 235, 242);
}
</style>
