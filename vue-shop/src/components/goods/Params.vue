<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许修改第三级的分类设置相关参数" type="warning" show-icon :closable="false">
      </el-alert>
      <el-row>
        <el-col :span="3">
          <span>选择产品分类：</span>
        </el-col>
        <el-col :span="9">
          <el-cascader v-model="selectCateKeys" :options="catelist" :props="cateProps" @change="handleCateChange"
            clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="tabsActive" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" icon="el-icon-plus" size="mini" plain :disabled="isBtnDisable"
            @click="showDialog('','add')">添加参数</el-button>
          <!-- <el-button type="primary" icon="el-icon-plus" size="mini" plain :disabled="isBtnDisable"
            @click="showManyDialog('','add')">添加参数</el-button> -->
          <el-table :data="cateManyList" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环展示 -->
                <el-tag type="" v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                  @close="handleTagClose(scope.row,i)">
                  {{item}}</el-tag>
                <!-- 添加 -->
                <el-input class="inputnewtag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button class="button-new-tag" size="small" @click="showInput(scope.row)"
                  :disabled="scope.row.inputVisible">+ 添加</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" @click="showDialog(scope.row,'edit')">编辑</el-button>
                <el-button type="text" icon="el-icon-edit" @click="delAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" icon="el-icon-plus" size="mini" plain :disabled="isBtnDisable"
            @click="showDialog('','add')">添加属性</el-button>
          <!-- <el-button type="primary" icon="el-icon-plus" size="mini" plain :disabled="isBtnDisable"
            @click="showOnlyDialog('','add')">添加属性</el-button> -->
          <el-table :data="cateOnlyList" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环展示 -->
                <el-tag type="" v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                  @close="handleTagClose(scope.row,i)">
                  {{item}}</el-tag>
                <!-- 添加 -->
                <el-input class="inputnewtag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button class="button-new-tag" size="small" @click="showInput(scope.row)"
                  :disabled="scope.row.inputVisible">+ 添加</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" @click="showDialog(scope.row,'edit')">编辑</el-button>
                <el-button type="text" icon="el-icon-edit" @click="delAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 对话框 (添加&&编辑动态参数) -->
    <el-dialog :title="dialogTitleFirst+dialogTitle" :visible="dialogVisible" @closed="dialogClosed">
      <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogFormRef">
        <el-form-item :label="dialogTitle + '：'" prop="attr_name">
          <el-input v-model="dialogForm.attr_name" :placeholder="'请输入'+ dialogTitle">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSub" v-if="dialogTitleFirst=='添加'">确 定</el-button>
        <el-button type="primary" @click="dialogEditSub" v-else>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 (添加&&编辑动态参数) -->
    <el-dialog title="动态参数" :visible="manyDialogVisible">
      <div>
        动态参数：
        <el-input placeholder="请输入动态参数">
        </el-input>
      </div>
      <span slot="footer">
        <el-button @click="manyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="manyDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 对话框 (添加&&编辑动态参数) -->
    <el-dialog title="静态属性" :visible="onlyDialogVisible">
      <span slot="footer">
        <el-button @click="onlyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onlyDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectCateKeys: [],
      tabsActive: 'many',
      // 获取的参数列表
      cateOnlyList: [],
      cateManyList: [],
      // 弹窗
      dialogVisible: false,
      dialogTitleFirst: '',
      dialogForm: {
        attr_name: ''
      },
      attrId: '',
      dialogFormRules: {
        attr_name: [{
          required: true, message: '必填项不能为空 ', trigger: 'blur'
        }]
      },
      // tag

      manyDialogVisible: false,
      onlyDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisable() {
      if (this.selectCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    creatId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2]
      } else {
        return null
      }
    },
    dialogTitle() {
      if (this.tabsActive === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log('11', res)
      this.catelist = res.data
    },
    handleCateChange() {
      console.log('this.selectCateKeys', this.selectCateKeys)
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.cateOnlyList = []
        this.cateManyList = []
        this.$message.error('只允许修改第三级的分类设置相关参数')
      } else {
        this.getCateAttributesList(this.selectCateKeys[2], 'many')
      }
    },
    handleTabsClick(tab, event) {
      // console.log('tab', tab, 'event', event)
      console.log('tabname', this.tabsActive)
      if (this.selectCateKeys.length === 3) {
        if (tab.index === '0') {
          this.getCateAttributesList(this.selectCateKeys[2], 'many')
        } else if (tab.index === '1') {
          this.getCateAttributesList(this.selectCateKeys[2], 'only')
        }
      }
    },
    // 获取参数列表
    async getCateAttributesList(id, sel) {
      const { data: res } = await this.$http.get(`categories/${id}/attributes`, { params: { sel } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加 newtag 的属性
        item.inputVisible = false
        item.inputValue = ''
      })
      if (sel === 'only') {
        this.cateOnlyList = res.data
        console.log('onlydate', res)
      } else if (sel === 'many') {
        this.cateManyList = res.data
        console.log('manydate', res)
      }
    },
    // 弹窗
    showDialog(row, type) {
      this.dialogVisible = true
      if (type === 'add') {
        this.dialogTitleFirst = '添加'
      } else if (type === 'edit') {
        this.dialogTitleFirst = '编辑'
      }
      console.log('row', row)
      this.attrId = row.attr_id
      this.dialogForm.attr_name = row.attr_name
    },
    dialogClosed() {
      this.$refs.dialogFormRef.resetFields()
    },
    dialogSub() {
      this.$refs.dialogFormRef.validate(async (val) => {
        if (!val) {
          return this.$message.error('请输入内容')
        }
        const { data: res } = await this.$http.post(`categories/${this.creatId}/attributes`, { attr_name: this.dialogForm.attr_name, attr_sel: this.tabsActive })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.dialogVisible = false
        this.getCateAttributesList(this.creatId, this.tabsActive)
        this.$message.success(res.meta.msg)
      })
    },
    // 编辑
    dialogEditSub() {
      this.$refs.dialogFormRef.validate(async (val) => {
        if (!val) {
          return this.$message.error('请输入内容')
        }
        const { data: res } = await this.$http.put(`categories/${this.creatId}/attributes/${this.attrId}`, { attr_name: this.dialogForm.attr_name, attr_sel: this.tabsActive })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.dialogVisible = false
        this.getCateAttributesList(this.creatId, this.tabsActive)
        this.$message.success(res.meta.msg)
      })
    },
    // 删除
    async delAttr(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => { console.log('error', error) })
      console.log('confirmResult', confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.creatId}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getCateAttributesList(this.creatId, this.tabsActive)
      this.$message.success(res.meta.msg)
    },
    // 删除 tag
    handleTagClose(row, i) {
      console.log('i', row, i)
      row.attr_vals.splice(i, 1)
      this.editArrtr(row)
    },
    // 添加 tag
    showInput(row) {
      row.inputVisible = true
      // 让输入框自动获取焦点 $nextTick 是页面元素被重新渲染后
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm(row) {
      // console.log('inputValue', this.inputValue)
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.editArrtr(row)
    },
    // 发起编辑请求
    async editArrtr(row) {
      const { data: res } = await this.$http.put(`categories/${this.creatId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log('res', res)
      this.getCateAttributesList(this.creatId, this.tabsActive)
      this.$message.success(res.meta.msg)
    },
    showManyDialog(row, type) {
      this.manyDialogVisible = true
    },
    showOnlyDialog(row, type) {
      this.onlyDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 8px;
}

.inputnewtag {
  width: 200px !important;
  margin: 8px;
}
</style>
