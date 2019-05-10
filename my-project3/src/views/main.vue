<template>
  <div id="app">
    <!-- 头部导航 -->
    <header class="header">
      <el-row>
        <el-col :span="4" class="col_user">{{user_name}}</el-col>
      </el-row>
    </header>
    <main>
      <!-- 左侧导航 -->
      <div class="main-left">
        <el-menu default-active="main/Orderlist" class="el-menu-vertical-demo" :router ="true" >
        <!--el-menu default-active="main/Orderlist" class="el-menu-vertical-demo" :router="true"-->
          <el-menu-item index="/main/Orderlist" :class="{'isActive': active}" >浏览单据</el-menu-item>
          <el-menu-item index="/main/goodslist" :class="{'isActive': !active}">选择商品</el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧主内容区 -->
      <div  class="main-right" >
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return {
      user_name:'' ,
      active: true
    }
  },
  mounted: function(){
    this.$nextTick(function () {
      this.user_name='当前用户:'+sessionStorage.getItem('user_name')
       this.$router.replace('main/Orderlist')
    //  this.$router.replace('')
    })
  }
}
</script>

<style>
  body{margin: 0;}
  #app {
    min-width: 800px;
    margin: 0 auto;
    font-family: "Helvetica Neue","PingFang SC",Arial,sans-serif;
  }
  /* 头部导航 */
  header{ height: 40px; z-index: 1000;transition: all 0.5s ease;  border-top: solid 4px #3091F2;  background-color: #fff;  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);  }
  header.header-fixed{position: fixed;top: 0;left: 0;right: 0;}
  header .el-menu-demo{padding-left: 100px!important;}

  /* 主内容区 */
  main{    display: -webkit-box;  display: -ms-flexbox;  display: flex;  min-height: 600px;  border: solid 20px #E9ECF1;  background-color: #FCFCFC;  }
  main .main-left{text-align: center;width: 150px;float: left;}
  main .main-right{-webkit-box-flex: 1;  -ms-flex: 1;  flex: 1;  background-color: #fff; padding: 10px 10px; }
  main .el-menu{background-color: transparent!important;}
  .col_user{
    padding-top: 10px;
    padding-left: 5px;


  }
</style>
