<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 查询 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" prefix-icon="el-icon-search"
            @keyup.enter.native="queryOrdersList" clearable @clear="queryOrdersList">
            <el-button @click="queryOrdersList" slot="append">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="ordersList" border>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag :type="scope.row.order_pay == '1'? 'success': 'warning'">
              {{scope.row.order_pay == '0'?'未付款':'已付款'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time |filterTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="editOrder(scope.row)">修改地址</el-button>
            <el-button type="text" icon="el-icon-box" @click="showKuaidi(scope.row)">查看物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[ 5, 10,20,50,100]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 对话框（修改地址） -->
    <el-dialog title="修改地址" :visible="addressDialogVisible" @close="addressDialogClosed">
      <el-form :model="address" :rules="addressRuls" ref="addressRef">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="address.address1" :options="cityData" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="address.address2" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddress()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框（物流信息） -->
    <el-dialog title="物流信息" :visible="kuaidiDialogVisible" @close="kuaidiDialogClosed">
      <!-- <el-form :model="kuaidi" ref="kuaidiRef"> -->
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(activity, index) in kuaidi" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <!-- </el-form> -->
      <span slot="footer">
        <el-button @click="kuaidiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="kuaidiDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: ''
      },
      ordersList: [],
      total: 0,
      addressDialogVisible: false,
      address: {
        address1: [],
        address2: ''
      },
      addressRuls: {
        address1: [{ required: true, message: '请选择', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData,
      kuaidiDialogVisible: false,
      kuaidi: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log('res', res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 查询
    queryOrdersList() {
      console.log('queryOrdersList', this.queryInfo.query)
      this.getOrdersList()
    },
    // 分页器相关
    handleSizeChange(newSize) {
      // console.log('newSize', newSize)
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      // console.log('newPage', newPage)
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 操作
    editOrder(row) {
      this.addressDialogVisible = true
    },
    handleChange(value) {
      console.log(value)
    },
    subAddress() {
      console.log('subAddress', this.address)
    },
    addressDialogClosed(done) {
      this.addressDialogVisible = false
      this.$refs.addressRef.resetFields()
      console.log('done', done)
    },
    async showKuaidi(row) {
      // 接口只提供了一个写死的 id
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // const { data: res } = await this.$http.get(`/kuaidi/${row.order_id}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      console.log('res', res)
      this.kuaidi = res.data
      this.kuaidiDialogVisible = true
    },
    kuaidiDialogClosed(done) {
      this.kuaidiDialogVisible = false
      // this.$refs.kuaidiRef.resetFields()
      console.log('done', done)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
