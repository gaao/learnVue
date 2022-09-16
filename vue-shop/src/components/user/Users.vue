<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 查询添加用户 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" prefix-icon="el-icon-search"
            @keyup.enter.native="search" clearable @clear="search">
            <el-button @click="search" slot="append">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList" border>
        <el-table-column type="index" label="序号" width="52px"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="uesrStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="showEditDilog(scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="deleteDilog(scope.row)">删除</el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="text" size="small" icon="el-icon-setting">设置</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addUserClosed">
      <el-form ref="addUserFromRef" :model="addUserFrom" :rules="addUserFromRules" label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addUserFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFrom.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserFrom.mobile" type="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDilogVisible" @colse="editUserClosed">
      <el-form ref="editUserFromRef" :model="editUserFrom" :rules="addUserFromRules" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="editUserFrom.username" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFrom.email" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserFrom.mobile" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDilogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 校验邮箱的规则
    var checkEmail = (rule, val, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(val)) {
        return cb() // 合法的
      }
      cb(new Error('请输入合法邮箱'))
    }
    // 校验电话的规则
    var chekMobile = (rule, val, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(val)) {
        return cb() // 合法的
      }
      cb(new Error('请输入合法手机'))
    }
    return {
      // 用户数据列表的请求参数
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      usersList: [],
      total: 0,
      pagenum: 1,
      // 控制添加用户对话框展示
      addDialogVisible: false,
      // 添加用户请求数据
      addUserFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFromRules: {
        username: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          // { message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          // { message: '请输入手机', trigger: 'blur' },
          { validator: chekMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户
      editDilogVisible: false,
      editUserFrom: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created() {
    this.getuserList()
  },
  methods: {
    async getuserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // pagesize 改变事件
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getuserList()
    },
    // 页码值改变的事件
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getuserList()
    },
    async uesrStateChange(row) {
      console.log('row', row)
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      console.log('res', res)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    search() {
      this.getuserList()
    },
    // 监听添加用户对话框关闭事件
    addUserClosed() {
      this.$refs.addUserFromRef.resetFields()
    },
    addUser() {
      this.$refs.addUserFromRef.validate(async (val) => {
        if (!val) { return false }
        const { data: res } = await this.$http.post('users', this.addUserFrom)
        console.log('res', res)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        } else {
          this.addDialogVisible = false
          this.getuserList()
          this.$message.success(res.meta.msg)
        }
      })
    },
    // 编辑用户信息
    showEditDilog(row) {
      console.log('row', row)
      this.editUserFrom.id = row.id
      this.editUserFrom.username = row.username
      this.editUserFrom.email = row.email
      this.editUserFrom.mobile = row.mobile
      this.editDilogVisible = true
    },
    editUserClosed() { this.$refs.editUserFromRef.resetFields() },
    editUser() {
      this.$refs.editUserFromRef.validate(async (val) => {
        if (!val) { return false }
        const { data: res } = await this.$http.put(`users/${this.editUserFrom.id}`, { email: this.editUserFrom.email, mobile: this.editUserFrom.mobile })
        console.log('res', res)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          this.editDilogVisible = false
          this.getuserList()
          this.$message.success(res.meta.msg)
        }
      })
    },
    // 删除用户
    async deleteDilog(row) {
      this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log('row', row)
        const { data: res } = await this.$http.delete('users/' + row.id)
        console.log('res', res)
        this.getuserList()
        this.$message.info(res.meta.msg)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>
<style lang="less" scoped>
.el-table {
  margin: 16px 0;
}

.el-pagination {
  float: right;
  margin-bottom: 16px;
}
</style>
