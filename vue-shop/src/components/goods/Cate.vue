<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showCateDialog('','add')" plain>添加分类</el-button>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
        <template slot="isOK" slot-scope="scope">
          <i class="el-icon-success isok" v-if="scope.row.cat_deleted === false"
            style="width: 18px; height: 18px;color: #4caf50;"></i>
          <i class="el-icon-error isok" v-else style="width: 18px; height: 18px;color: #ff9800;"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="" v-if="scope.row.cat_level === 0" effect="plain">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1" effect="plain">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2" effect="plain">三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showCateDialog(scope.row,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- <el-table :data="cateList">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted"></el-table-column>
        <el-table-column label="排序" prop="cat_level"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table> -->
      <!-- 翻页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 对话框（添加 & 编辑分类） -->
    <el-dialog :title="cateDialogTitle+'分类'" :visible.sync="cateDialogVisible" @close="cateDialogClosed">
      <el-form :model="cateDialogForm" :rules="cateDialogFormRules" ref="cateDialogFormRef" label-width="100px">
        <el-form-item label="选择父级" v-if="cateDialogTitle==='添加'">
          <el-cascader v-model="cateParentListSelect" :options="cateParentList" :props="cascaderProps"
            @change="handleCateChange" clearable>
            <!-- <template slot-scope="{ node, data }">
              <span>{{ data.cat_name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template> -->
          </el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateDialogForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate" v-if="cateDialogTitle==='添加'">确 定</el-button>
        <el-button type="primary" @click="editCate" v-else-if="cateDialogTitle==='编辑'">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // prop: 'cat_deleted',
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      // 添加 & 编辑分类相关
      cateDialogVisible: false,
      cateDialogTitle: '',
      cateDialogForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      cat_id: '',
      cateDialogFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 级联
      cateParentList: [],
      cateParentListSelect: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log('res', res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 分页器
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log('res', res)
      this.cateParentList = res.data
    },
    // 添加 & 编辑分类
    showCateDialog(row, type) {
      if (type === 'add') {
        this.cateDialogTitle = '添加'
      } else if (type === 'edit') {
        this.cateDialogTitle = '编辑'
        console.log('row', row.cat_id)
        this.cat_id = row.cat_id
        this.cateDialogForm.cat_name = row.cat_name
      }
      this.getParentCateList()
      this.cateDialogVisible = true
    },
    handleCateChange(val) {
      console.log('val', val)
      console.log('cateDialogForm', this.cateDialogForm)
      console.log('cateParentListSelect', this.cateParentListSelect)
      if (this.cateParentListSelect.length > 0) {
        this.cateDialogForm.cat_pid = this.cateParentListSelect[this.cateParentListSelect.length - 1]
        // 为当前分类的等级赋值
        this.cateDialogForm.cat_level = this.cateParentListSelect.length
      } else {
        this.cateDialogForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.cateDialogForm.cat_level = 0
      }
    },
    addCate() {
      console.log('this.cateDialogForm', this.cateDialogForm)
      this.$refs.cateDialogFormRef.validate(async (val) => {
        if (!val) {
          return this.$message.error('请输入信息')
        }
        const { data: res } = await this.$http.post('categories', this.cateDialogForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getCateList()
        this.cateDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    async editCate() {
      this.$refs.cateDialogFormRef.validate(async (val) => {
        if (!val) {
          return this.$message.error('请输入信息')
        }
        const { data: res } = await this.$http.put(`categories/${this.cat_id}`, { cat_name: this.cateDialogForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getCateList()
        this.cateDialogVisible = false
        this.$message.success(res.meta.msg)
        console.log('res', res)
      })
    },
    // 关闭分类对话框
    cateDialogClosed() {
      this.$refs.cateDialogFormRef.resetFields()
      this.cateParentListSelect = []
      this.cateDialogForm.cat_pid = 0
      this.cateDialogForm.cat_level = 0
      this.cateDialogForm.cat_name = ''
    },
    // 删除
    async deleteCate(row) {
      const { data: res } = await this.$http.delete(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getCateList()
      this.$message.success(res.meta.msg)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.zk-table--row-hover {
  background-color: #F5F7FA;
}

.zk-table {
  margin: 16px 0;

  .isok {
    font-size: 18px;
    // /deep/.el-icon-success {
    //   background-color: red;
    // }
  }
}
</style>
