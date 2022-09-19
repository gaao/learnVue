<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 查询添加用户 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" prefix-icon="el-icon-search"
            @keyup.enter.native="getGoodsList" clearable @clear="getGoodsList">
            <el-button @click="getGoodsList" slot="append">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-plus" @click="goGoodsInfo('','add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="300px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="goods_state" label="商品状态"></el-table-column>
        <el-table-column prop="add_time" label="添加时间" width="110px">
          <template slot-scope="scope">{{scope.row.add_time |filterTime}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="showGoodsDialog(scope.row,'edit')">编辑
            </el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="delGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[ 5, 10,20,50,100]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 对话框（添加 & 编辑商品） -->
    <el-dialog :title="goodsTitle+'商品'" :visible="goodsDialogVisible"></el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 弹窗
      goodsTitle: '',
      goodsDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 查询列表
    async getGoodsList() {
      console.log('11')
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log('res', res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 翻页器
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 添加 & 编辑商品
    showGoodsDialog(row, type) {
      this.goodsDialogVisible = true
      if (type === 'add') {
        this.goodsTitle = '添加'
      } else if (type === 'edit') {
        this.goodsTitle = '编辑'
        console.log('row', row)
      }
    },
    // 添加 & 编辑商品页面
    goGoodsInfo(row, type) {
      this.$router.push({
        path: '/goods/goodsinfo',
        query: { row, type }
      }
      )
    },
    //  删除商品
    async delGoods(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => { console.log('error', error) })
      console.log('confirmResult', confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('rwo', row)
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getGoodsList()
      this.$message.success(res.meta.msg)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
