import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import Vuex from 'vuex'

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
   // console.log('需要登录');
    if (sessionStorage.token) { // 判断当前的token是否存在 ； 登录存入的token
      next();
    }
    else {
      next({
        path: '/',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});


Vue.use(ElementUI)
Vue.use(Vuex)
Vue.config.productionTip = false
axios.defaults.timeout = 10000;// 在超时前，所有请求都会等待 10 秒
axios.defaults.baseURL = 'http://192.168.1.59:5000';// 配置接口地址
//axios.defaults.baseURL ='https'
Vue.prototype.$axios=axios;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

///2019年4月27日 16:29:15加入//验证是否登入系统
