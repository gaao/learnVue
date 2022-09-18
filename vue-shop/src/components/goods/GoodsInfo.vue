<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert :title="alertTite+'商品信息'" type="warning" :closable="false">
      </el-alert>
      <el-steps :active="stepActive-0" finish-status="success" align-center>
        <el-step title="基本信息"> </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="goodsForm" :rules="goodsFormRules" ref="goodsFormRef" label-position="top">
        <el-tabs v-model="stepActive" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" placeholder="请输入商品价格"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" placeholder="请输入商品重量"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" placeholder="请输入商品数量"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- <el-select v-model="goodsForm.goods_cat" placeholder="请输入商品分类">>
                <el-option :label="" :value=""></el-option>
              </el-select> -->
              <el-cascader v-model="goodsForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableDate" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(val,i) in item.attr_vals" :label="val" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item) in onlyTableDate" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals" :placeholder="'请输入'+item.attr_name"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="upLodaUrl" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList"
              list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip">只能上传 jpg/png 文件，且不超过 500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
            <!-- 添加商品的提交按钮 -->
            <el-button type="" @click="subFormBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 对话框（预览图片） -->
    <el-dialog title="图片查看" :visible="picDialogVisible" @close="picDialogVisible = false">
      <img :src="picSrc" alt="" class="previewPic">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      query: {},
      alertTite: '',
      stepActive: '0',
      // 表单
      goodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      goodsFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品信息
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 参数
      manyTableDate: [],
      checkList: [],
      onlyTableDate: [],
      upLodaUrl: 'https://lianghj.top:8888/api/private/v1/upload',
      fileList: [],
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      // 图片预览
      picDialogVisible: false,
      picSrc: ''
    }
  },
  created() {
    this.query = this.$route.query
    if (!this.query) {
      // var 参数 = query.参数名;
      return console.log('没用带过来数据')
    } else if (this.query.type === 'add') {
      this.alertTite = '添加'
    } else {
      return console.log('类型不明')
    }
    this.getCateList()
  },
  computed: {
    // whereType() {
    // }
    cateId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
      console.log('cateList', this.cateList)
    },
    handleChange(val) {
      console.log('val', val)
      console.log('val1', this.goodsForm.goods_cat)
      if (val.length !== 3) {
        this.goodsForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.goodsForm.goods_cat.length !== 3) {
        this.$message.error('商品分类不能为空')
        return false
      }
    },
    async tabClicked(i) {
      console.log('i.index', i.index)
      console.log('stepActive', this.stepActive)
      // 获取参数列表
      if (this.stepActive === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        res.data.forEach(item => { item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ') })
        this.manyTableDate = res.data
        // this.$message.success(res.meta.msg)
        console.log('checkList', this.checkList)
      } else if (this.stepActive === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        console.log('res', res)
        this.onlyTableDate = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      console.log('p', file)
      this.picSrc = file.url
      this.picDialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log('2', file, fileList)
      // 获取删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 查找出当前数据里对应的索引值
      const i = this.goodsForm.pics.findIndex(index => index.pic === filePath)
      // 用索引值从数据中移除
      this.goodsForm.pics.splice(i, 1)
      console.log('this.goodsForm', this.goodsForm)
    },
    handleSuccess(response) {
      console.log('response', response)
      const picInfo = { pic: response.data.tmp_path }
      this.goodsForm.pics.push(picInfo)
      console.log('this.goodsForm', this.goodsForm)
    },
    subFormBtn() {
      this.$refs.goodsFormRef.validate(async (val) => {
        if (!val) {
          return this.$message.error('请完成必填项')
        }
        // 深拷贝
        const form = _.cloneDeep(this.goodsForm)
        // 处理分类列表
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyTableDate.forEach(item => {
          const manyInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.goodsForm.attrs.push(manyInfo)
        })
        this.onlyTableDate.forEach(item => {
          const onlyInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.goodsForm.attrs.push(onlyInfo)
        })
        form.attrs = this.goodsForm.attrs
        // const manydate = { attr_id: this.manyTableDate.attr_id, attr_value: this.manyTableDate.attr_value }
        // const onlydate = { attr_id: this.onlyTableDate.attr_id, attr_value: this.onlyTableDate.attr_value }
        // this.goodsForm =
        console.log('form', form)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  min-height: calc(100vh - 140px);
}

.el-checkbox {
  margin-right: 8px !important;
}

.el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 0;
}

.previewPic {
  width: 100%;
}
</style>
