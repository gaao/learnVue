"use strict";(self["webpackChunkvue_shop"]=self["webpackChunkvue_shop"]||[]).push([[426],{5072:function(t,e,o){o.r(e),o.d(e,{default:function(){return g}});var s=function(){var t=this,e=t._self._c;return e("div",[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),e("el-breadcrumb-item",[t._v("商品管理")]),e("el-breadcrumb-item",[t._v("商品列表")])],1),e("el-card",[e("el-alert",{attrs:{title:t.alertTite+"商品信息",type:"warning",closable:!1}}),e("el-steps",{attrs:{active:t.stepActive-0,"finish-status":"success","align-center":""}},[e("el-step",{attrs:{title:"基本信息"}}),e("el-step",{attrs:{title:"商品参数"}}),e("el-step",{attrs:{title:"商品属性"}}),e("el-step",{attrs:{title:"商品图片"}}),e("el-step",{attrs:{title:"商品内容"}}),e("el-step",{attrs:{title:"完成"}})],1),e("el-form",{ref:"goodsFormRef",attrs:{model:t.goodsForm,rules:t.goodsFormRules,"label-position":"top"}},[e("el-tabs",{attrs:{"tab-position":"left","before-leave":t.beforeTabLeave},on:{"tab-click":t.tabClicked},model:{value:t.stepActive,callback:function(e){t.stepActive=e},expression:"stepActive"}},[e("el-tab-pane",{attrs:{label:"基本信息",name:"0"}},[e("el-form-item",{attrs:{label:"商品名称",prop:"goods_name"}},[e("el-input",{attrs:{placeholder:"请输入商品名称"},model:{value:t.goodsForm.goods_name,callback:function(e){t.$set(t.goodsForm,"goods_name",e)},expression:"goodsForm.goods_name"}})],1),e("el-form-item",{attrs:{label:"商品价格",prop:"goods_price"}},[e("el-input",{attrs:{placeholder:"请输入商品价格"},model:{value:t.goodsForm.goods_price,callback:function(e){t.$set(t.goodsForm,"goods_price",e)},expression:"goodsForm.goods_price"}})],1),e("el-form-item",{attrs:{label:"商品重量",prop:"goods_weight"}},[e("el-input",{attrs:{placeholder:"请输入商品重量"},model:{value:t.goodsForm.goods_weight,callback:function(e){t.$set(t.goodsForm,"goods_weight",e)},expression:"goodsForm.goods_weight"}})],1),e("el-form-item",{attrs:{label:"商品数量",prop:"goods_number"}},[e("el-input",{attrs:{placeholder:"请输入商品数量"},model:{value:t.goodsForm.goods_number,callback:function(e){t.$set(t.goodsForm,"goods_number",e)},expression:"goodsForm.goods_number"}})],1),e("el-form-item",{attrs:{label:"商品分类",prop:"goods_cat"}},[e("el-cascader",{attrs:{options:t.cateList,props:t.cateProps},on:{change:t.handleChange},model:{value:t.goodsForm.goods_cat,callback:function(e){t.$set(t.goodsForm,"goods_cat",e)},expression:"goodsForm.goods_cat"}})],1)],1),e("el-tab-pane",{attrs:{label:"商品参数",name:"1"}},t._l(t.manyTableDate,(function(o){return e("el-form-item",{key:o.attr_id,attrs:{label:o.attr_name}},[e("el-checkbox-group",{model:{value:o.attr_vals,callback:function(e){t.$set(o,"attr_vals",e)},expression:"item.attr_vals"}},t._l(o.attr_vals,(function(t,o){return e("el-checkbox",{key:o,attrs:{label:t,border:""}})})),1)],1)})),1),e("el-tab-pane",{attrs:{label:"商品属性",name:"2"}},t._l(t.onlyTableDate,(function(o){return e("el-form-item",{key:o.attr_id,attrs:{label:o.attr_name}},[e("el-input",{attrs:{placeholder:"请输入"+o.attr_name},model:{value:o.attr_vals,callback:function(e){t.$set(o,"attr_vals",e)},expression:"item.attr_vals"}})],1)})),1),e("el-tab-pane",{attrs:{label:"商品图片",name:"3"}},[e("el-upload",{attrs:{action:t.upLodaUrl,"on-preview":t.handlePreview,"on-remove":t.handleRemove,"file-list":t.fileList,"list-type":"picture",headers:t.headerObj,"on-success":t.handleSuccess}},[e("el-button",{attrs:{size:"small",type:"primary"}},[t._v("点击上传")])],1)],1),e("el-tab-pane",{attrs:{label:"商品内容",name:"4"}},[e("quill-editor",{model:{value:t.goodsForm.goods_introduce,callback:function(e){t.$set(t.goodsForm,"goods_introduce",e)},expression:"goodsForm.goods_introduce"}}),e("el-button",{attrs:{type:""},on:{click:t.subFormBtn}},[t._v("添加商品")])],1)],1)],1)],1),e("el-dialog",{attrs:{title:"图片查看",visible:t.picDialogVisible},on:{close:function(e){t.picDialogVisible=!1}}},[e("img",{staticClass:"previewPic",attrs:{src:t.picSrc,alt:""}})])],1)},a=[],r=o(2611),i=o.n(r),l={data(){return{query:{},alertTite:"",stepActive:"0",goodsForm:{goods_name:"",goods_price:0,goods_weight:0,goods_number:0,goods_cat:[],pics:[],goods_introduce:"",attrs:[]},goodsFormRules:{goods_name:[{required:!0,message:"请输入商品名称",trigger:"blur"}],goods_price:[{required:!0,message:"请输入商品价格",trigger:"blur"}],goods_weight:[{required:!0,message:"请输入商品重量",trigger:"blur"}],goods_number:[{required:!0,message:"请输入商品数量",trigger:"blur"}],goods_cat:[{required:!0,message:"请选择商品分类",trigger:"blur"}]},cateList:[],cateProps:{label:"cat_name",value:"cat_id",children:"children"},manyTableDate:[],checkList:[],onlyTableDate:[],upLodaUrl:"https://lianghj.top:8888/api/private/v1/upload",fileList:[],headerObj:{Authorization:window.sessionStorage.getItem("token")},picDialogVisible:!1,picSrc:""}},created(){this.query=this.$route.query,this.query&&"add"===this.query.type&&(this.alertTite="添加",this.getCateList())},computed:{cateId(){return 3===this.goodsForm.goods_cat.length?this.goodsForm.goods_cat[2]:null}},methods:{async getCateList(){const{data:t}=await this.$http.get("categories");if(200!==t.meta.status)return this.$message.error(t.meta.msg);this.cateList=t.data},handleChange(t){3!==t.length&&(this.goodsForm.goods_cat=[])},beforeTabLeave(t,e){if("0"===e&&3!==this.goodsForm.goods_cat.length)return this.$message.error("商品分类不能为空"),!1},async tabClicked(t){if("1"===this.stepActive){const{data:t}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:"many"}});if(200!==t.meta.status)return this.$message.error(t.meta.msg);t.data.forEach((t=>{t.attr_vals=0===t.attr_vals.length?[]:t.attr_vals.split(" ")})),this.manyTableDate=t.data}else if("2"===this.stepActive){const{data:t}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:"only"}});if(200!==t.meta.status)return this.$message.error(t.meta.msg);this.onlyTableDate=t.data}},handlePreview(t){this.picSrc=t.url,this.picDialogVisible=!0},handleRemove(t,e){const o=t.response.data.tmp_path,s=this.goodsForm.pics.findIndex((t=>t.pic===o));this.goodsForm.pics.splice(s,1)},handleSuccess(t){const e={pic:t.data.tmp_path};this.goodsForm.pics.push(e)},subFormBtn(){this.$refs.goodsFormRef.validate((async t=>{if(!t)return this.$message.error("请完成必填项");const e=i().cloneDeep(this.goodsForm);e.goods_cat=e.goods_cat.join(","),this.manyTableDate.forEach((t=>{const e={attr_id:t.attr_id,attr_value:t.attr_vals.join(" ")};this.goodsForm.attrs.push(e)})),this.onlyTableDate.forEach((t=>{const e={attr_id:t.attr_id,attr_value:t.attr_vals};this.goodsForm.attrs.push(e)})),e.attrs=this.goodsForm.attrs;const{data:o}=await this.$http.post("goods",e);if(201!==o.meta.status)return this.$message.error(o.meta.msg);this.$message.success(o.meta.msg),this.$router.push("/goods")}))}}},n=l,d=o(1001),c=(0,d.Z)(n,s,a,!1,null,"cc00fe70",null),g=c.exports},5462:function(t,e,o){o.r(e),o.d(e,{default:function(){return d}});var s=function(){var t=this,e=t._self._c;return e("div",[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),e("el-breadcrumb-item",[t._v("商品管理")]),e("el-breadcrumb-item",[t._v("商品列表")])],1),e("el-card",[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:12}},[e("el-input",{attrs:{placeholder:"请输入内容","prefix-icon":"el-icon-search",clearable:""},on:{clear:t.getGoodsList},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.getGoodsList.apply(null,arguments)}},model:{value:t.queryInfo.query,callback:function(e){t.$set(t.queryInfo,"query",e)},expression:"queryInfo.query"}},[e("el-button",{attrs:{slot:"append"},on:{click:t.getGoodsList},slot:"append"},[t._v("搜索")])],1)],1),e("el-col",{attrs:{span:6}},[e("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(e){return t.goGoodsInfo("","add")}}},[t._v("添加商品")])],1)],1),e("el-table",{attrs:{data:t.goodsList,border:""}},[e("el-table-column",{attrs:{type:"index",label:"序号"}}),e("el-table-column",{attrs:{prop:"goods_name",label:"商品名称",width:"300px"}}),e("el-table-column",{attrs:{prop:"goods_price",label:"商品价格"}}),e("el-table-column",{attrs:{prop:"goods_weight",label:"商品重量"}}),e("el-table-column",{attrs:{prop:"goods_state",label:"商品状态"}}),e("el-table-column",{attrs:{prop:"add_time",label:"添加时间",width:"110px"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t._f("filterTime")(e.row.add_time)))]}}])}),e("el-table-column",{attrs:{fixed:"right",label:"操作",width:"120px"},scopedSlots:t._u([{key:"default",fn:function(o){return[e("el-button",{attrs:{type:"text",size:"small",icon:"el-icon-edit"},on:{click:function(e){return t.showGoodsDialog(o.row,"edit")}}},[t._v("编辑 ")]),e("el-button",{attrs:{type:"text",size:"small",icon:"el-icon-delete"},on:{click:function(e){return t.delGoods(o.row)}}},[t._v("删除")])]}}])})],1),e("el-pagination",{attrs:{"current-page":t.queryInfo.pagenum,"page-sizes":[5,10,20,50,100],"page-size":t.queryInfo.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),e("el-dialog",{attrs:{title:t.goodsTitle+"商品",visible:t.goodsDialogVisible}})],1)},a=[],r={data(){return{goodsList:[],queryInfo:{query:"",pagenum:1,pagesize:5},total:0,goodsTitle:"",goodsDialogVisible:!1}},created(){this.getGoodsList()},methods:{async getGoodsList(){const{data:t}=await this.$http.get("goods",{params:this.queryInfo});if(200!==t.meta.status)return this.$message.error(t.meta.msg);this.goodsList=t.data.goods,this.total=t.data.total},handleSizeChange(t){this.queryInfo.pagesize=t,this.getGoodsList()},handleCurrentChange(t){this.queryInfo.pagenum=t,this.getGoodsList()},showGoodsDialog(t,e){this.goodsDialogVisible=!0,"add"===e?this.goodsTitle="添加":"edit"===e&&(this.goodsTitle="编辑")},goGoodsInfo(t,e){this.$router.push({path:"/goods/goodsinfo",query:{row:t,type:e}})},async delGoods(t){const e=await this.$confirm("此操作将永久删除该商品，是否继续？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((t=>{}));if("confirm"!==e)return this.$message.info("取消了删除");const{data:o}=await this.$http.delete(`goods/${t.goods_id}`);if(200!==o.meta.status)return this.$message.error(o.meta.msg);this.getGoodsList(),this.$message.success(o.meta.msg)}}},i=r,l=o(1001),n=(0,l.Z)(i,s,a,!1,null,"37c6bf59",null),d=n.exports}}]);
//# sourceMappingURL=List_GoodsInfo.8a5727b9.js.map