/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.deptName" placeholder="输入商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="gid" label="商品代码" width="200">
      </el-table-column>
      <el-table-column sortable prop="name" label="商品名称" width="200">
      </el-table-column>
      <el-table-column sortable prop="price" label="商品价格" width="300">
      </el-table-column>
      <el-table-column sortable prop="stock" label="商品库存量" width="300">
      </el-table-column>
      <el-table-column sortable prop="goodsDetails" label="商品描述" width="300">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template #default="scope">
          <v-slot>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods(scope.$index,scope.row.gid)">删除</el-button>
          </v-slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="商品名称" prop="deptName">
          <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="deptPrice">
          <el-input size="small" v-model="editForm.deptPrice" auto-complete="off" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品库存量" prop="deptStock">
          <el-input size="small" v-model="editForm.deptStock" auto-complete="off" placeholder="请输入商品库存量"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="deptDetails">
          <el-input size="small" v-model="editForm.deptDetails" auto-complete="off" placeholder="请输入商品描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '../../components/Pagination'
import axios from "axios";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        deptName: '',
        deptPrice:'',
        deptStock:'',
        deptDetails:'',
        token: localStorage.getItem('token')
      },
      // rules表单验证
      rules: {
        deptName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        deptPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        deptStock: [
          { required: true, message: '请输入商品库存量', trigger: 'blur' }
        ],
        deptDetails: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ]
      },
      formInline: {
        page: 1,
        limit: 10,
        varLable: '',
        varName: '',
        token: localStorage.getItem('token')
      },
      // 删除商品
      seletedata: {
        ids: '',
        token: localStorage.getItem('token')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },

  created() {
    this.getdata(this.formInline)
  },


  methods: {
    getdata() {
      axios.get("/Goods/getAllGoods").then(res =>{
        if (res.data.code == 200){
          this.$message({
            type: 'success',
            message: '获取商品信息成功'
          })
          this.listData = res.data.data;
        }else{
          this.$message({
            type: 'info',
            message: '获取商品信息失败'
          })
        }

      })
      this.pageparm.currentPage = this.formInline.page
      this.pageparm.pageSize = this.formInline.limit
      this.pageparm.total = res.count
      // 模拟数据结束

    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      //alert(this.formInline.deptName)
      if(this.formInline.deptName == ''){
        this.getdata(this.formInline)
      }else{
        this.$axios.get("/Goods/search",{params:{name:this.formInline.deptName}})
          .then(res => {
            if(res.data.code == 200){
              this.$message({
                type: 'success',
                message: '查找成功'
              })
              this.listData = res.data.data
            }else{
              this.$message({
                type: 'info',
                message: '查找失败'
              })
            }
          })
      }
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.deptId = row.gid
        this.editForm.deptName = row.name
        this.editForm.deptPrice = row.price
        this.editForm.deptStock = row.stock
        this.editForm.deptDetails = row.goodsDetails
      } else {
        this.editForm.deptId = ''
        this.editForm.deptName = ''
        this.editForm.deptPrice = ''
        this.editForm.deptStock = ''
        this.editForm.deptDetails = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          this.$axios.put("/Goods/update",{
            gid:this.editForm.deptId,
            name:this.editForm.deptName,
            price:this.editForm.deptPrice,
            stock:this.editForm.deptStock,
            goodsDetails:this.editForm.deptDetails
          })
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '信息保存成功！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: "信息保存失败！"
                })
              }
            })
        } else {
          return false
        }
      })
    },
    //删除
    deleteGoods(index, id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete("/Goods/delete",{params:{id:id}})
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: "删除失败"
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>


