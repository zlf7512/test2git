import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main.vue'
import Login from '@/components/Login.vue'
import Orderlist from "@/views/orderlist.vue";
import goodslist from "@/views/goodslist.vue";

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
routes: [
    {
      path: '/',
      name: 'Login',
      component: Login//2019年4月27日 16:31:29加入
       //component: Login
    },

    {
      path: '/main',
      name: 'Main',
      meta: {
        requireAuth: true, // 判断是否需要登录
      },

      component: Main,
      children: [
        {
          path: 'Orderlist',
          component: Orderlist,
          meta: {
            requireAuth: true, // 判断是否需要登录
          }
        },
        {
          path: 'goodslist',
          component: goodslist,
          meta: {
            requireAuth: true, // 判断是否需要登录
          }
        }
      ]
    }
  ]
})


