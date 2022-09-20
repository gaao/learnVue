<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showRolseDialog('','add')">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row :gutter="20" v-for="(item1) in  scope.row.children" :key="item1.id">
              <el-col :span="4">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 二级 -->
                <el-row class="cleartop" v-for="(item2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级 -->
                    <el-tag type="info" v-for="(item3) in item2.children" :key="item3.id" closable
                      @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="52px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="描述"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="showRolseDialog(scope.row,'edit')">编辑
            </el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="text" size="small" icon="el-icon-setting" @click="showSetRightDilog(scope.row)">分配权限
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加\编辑角色对话框 -->
    <el-dialog :title="roleDialogTitle +'角色'" :visible.sync="addAndEditRolseVisible">
      <div>
        <p>角色名称：<el-input v-model="roleInfo.roleName" placeholder="请输入角色名称"></el-input>
        </p>
        <p>角色描述：<el-input v-model="roleInfo.roleDesc" placeholder="请输入角色描述"></el-input>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRightDilogVisible = false">取 消</el-button>
        <el-button v-if="roleDialogType === 'add'" type="primary" @click="setAddRolse">确 定</el-button>
        <el-button v-if="roleDialogType === 'edit'" type="primary" @click="setEditRolse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDilogVisible" @close="setRightDilogClosed">
      <el-tree :data="rgihtsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defKey">
      </el-tree>
      <!-- <span>{{rgihtsList}}</span> -->
      <span slot="footer">
        <el-button @click="setRightDilogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRihgts">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 添加角色
      addAndEditRolseVisible: false,
      roleDialogTitle: '',
      roleDialogType: '',
      // 添加角色的信息
      roleInfo: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rolesList: [],
      // 控制分配权限对话框展示
      setRightDilogVisible: false,
      // 所有权限树型结构数据
      rgihtsList: [],
      // 树型结构展示规则
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中树型权限
      defKey: [],
      // 当前行的 roleid
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log('res', res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    // 添加、编辑角色
    showRolseDialog(row, type) {
      if (type === 'add') {
        this.roleDialogTitle = '添加'
      } else if (type === 'edit') {
        this.roleDialogTitle = '编辑'
        this.roleInfo.roleName = row.roleName
        this.roleInfo.roleDesc = row.roleDesc
      }
      this.roleInfo.roleId = row.id
      this.roleDialogType = type
      this.addAndEditRolseVisible = true
    },
    async setAddRolse() {
      const { data: res } = await this.$http.post('roles', { roleName: this.roleInfo.roleName, roleDesc: this.roleInfo.roleDesc })
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.addAndEditRolseVisible = false
      this.getRolesList()
      this.$message.success(res.meta.msg)
    },
    async setEditRolse() {
      const { data: res } = await this.$http.put(`roles/${this.roleInfo.roleId}`, { roleName: this.roleInfo.roleName, roleDesc: this.roleInfo.roleDesc })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.addAndEditRolseVisible = false
      this.getRolesList()
      this.$message.success(res.meta.msg)
    },
    // 删除角色
    async deleteRole(row) {
      console.log('row', row)
      const confirmResult = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => { console.log('error', error) })
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('确认了删除')
      const { data: res } = await this.$http.delete(`roles/${row.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getRolesList()
      this.$message.success(res.meta.msg)
    },
    // 根据 ID 删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => { console.log('error', error) })
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('确认了删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log('res', res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.getRolesList()
      role.children = res.data
      this.$message.success(res.meta.msg)
    },
    async showSetRightDilog(role) {
      // 获取所以权限树型结构
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rgihtsList = res.data
      console.log('data', res.data)
      this.getDefkey(role, this.defKey)
      this.roleId = role.id
      this.setRightDilogVisible = true
    },
    // 通过递归获取三级节点保存到 defkey 中
    getDefkey(node, arr) {
      // 如果没有 children 说明是第三级节点，把 id 保持到 arr
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果有则把二级节点（或一级）历出来调用 getDefkey
      node.children.forEach(item => {
        this.getDefkey(item, arr)
      })
      console.log('arr', arr)
    },
    // 关闭授权对话框
    setRightDilogClosed() {
      // 清空选择展示 arr
      this.defKey = []
    },
    // 点击提交为角色分配权限
    async allotRihgts() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idKey = keys.join(',')
      console.log('idKey', idKey)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idKey })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDilogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  border-bottom: 1px solid #e5e7ed;
  display: flex;
  align-items: center;
  background-color: #f6f7fa;
}

.el-table {
  margin-top: 16px;
}

// /deep/.el-table__cell /deep/.el-table__expanded-cell {
//   padding: 0;
// }
.el-row:first-child {
  border-top: 1px solid #e5e7ed;
}

.cleartop:first-child {
  border-top: none;
}

.cleartop:last-child {
  border-bottom: none;
}

.el-tag {
  margin: 6px;
}
</style>
