// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';

import Goods from '@/views/goods/Goods';

import Register from "../views/Register";

import Facility from "../views/system/Facility";






Vue.use(Router);

export default new Router({
  mode:'history',
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    },
      {
        path:'/register',
        name:"register",
        component:Register
      },
      {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: '首页',
        component: index,
        iconCls: 'el-icon-tickets',
        meta:{
          requireAuth: true
        },
        children: [{
            path: '/goods/Goods',
            name: '商品管理',
            component: Goods,
            meta: {
                requireAuth: true
            }
        },
          {
            path: '/system/Facility',
            name: '设备管理',
            component: Facility,
            meta: {
                requireAuth: true
            }
        }]
    }]
})
