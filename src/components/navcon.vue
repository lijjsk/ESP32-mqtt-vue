/**
* 头部菜单
*/
<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
    <el-button class="buttonimg">
      <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">
    </el-button>
    <el-submenu index="2" class="submenu">

      <template slot="title">超级管理员</template>
      <el-menu-item @click="exit()" index="2-3">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>

export default {
  name: 'navcon',
  data() {
    return {
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {}
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.user = JSON.parse(localStorage.getItem('userdata'))
  },
  methods: {
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.post("/myLogout").then(response =>{
            if (response.data.code == 200){
              setTimeout(() => {
                this.$store.commit('$_removeStorage')
                this.$store.commit('logout', 'false')
                this.$router.push({ path: '/login' })
                this.$message({
                  type: 'success',
                  message: '已退出登录!'
                })
              }, 1000)
            }else{
              this.$message({
                type: 'success',
                message: '退出登录失败'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$root.Bus.$emit('toggle', this.collapsed)
    }
  }
}
</script>
<style scoped>

.submenu {
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
</style>
