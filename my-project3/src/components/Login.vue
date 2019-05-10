<template>
  <el-form :model="ruleForm2"  ref="ruleForm2" label-position="left" label-width="0px" :rules="rules2"   class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" required  placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass"  auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="ruleForm2.check" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="login">登录</el-button>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="cancel" style="width:100%;" @click="handleSubmit1">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      loging: false,
      ruleForm2: {
        check: false,
        account: '',
        checkPass: ''

      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },

        ]
      }
    }
  },
  mounted: function(){
    this.$nextTick(function () {
      if (localStorage.getItem('user'))
        this.ruleForm2.account = localStorage.getItem('user')
 })
  },
  methods: {
      login: function () {
       if( this.ruleForm2.account!=="" & this.ruleForm2.checkPass!=="")
       {
         this.$axios.get('/get', {
           params: {
             name: this.ruleForm2.account,
             pass: this.ruleForm2.checkPass
           }
         })
                 .then( (res)=> {
                   console.log(res.data)
                   console.log(this.ruleForm2.account)
                   if(res.data.mobile==this.ruleForm2.account) {
                     sessionStorage.setItem('token', 'ok')
                     sessionStorage.setItem('user_name',res.data.sup_name)
                     localStorage.setItem('mobile',res.data.mobile)
                     localStorage.setItem('oper_id',res.data.supcust_no)
                     this.$router.push({path: '/main'})
                   }
                   else
                     console.log("密码错误")
                 })
                 .catch(function (err) {
                   console.log(err);
                 });
       }


          },
    handleSubmit2 () {
      this.$router.push({ path: '/main' })
    },
    handleSubmit1 () {
      this.ruleForm2.account = ''
      this.ruleForm2.checkPass= ''

    }
  }

}
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
   margin: 200px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
