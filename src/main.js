import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
// 引入路由
import router from './router';
// 引入状态管理
import store from './vuex/store';
// 引入icon
import './assets/icon/iconfont.css'
// 引入echarts
import echarts from 'echarts'
import axios from 'axios';
// 过滤器
import * as custom from './utils/util'
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts
// 使用element UI
Vue.use(ElementUI);
//配置后台url
axios.defaults.baseURL='http://localhost:8081'

//添加请求拦截器
axios.interceptors.request.use(
  config =>{
    if (store.state.token){
      config.headers.common['token'] = store.state.token
      console.log(store.state.token)
    }
    // config.headers.token = window.localStorage.token
    return config;
  },
  error => {
    console.log("tokenerror")
    //对请求错误做什么
    return Promise.reject(error);
  }
)
//http response响应拦截器
axios.interceptors.response.use(
  response =>{
    return response;
  },
  error=>{
    if(error.response){
      switch(error.response.status){
        case 401:
          localStorage.removeItem('token');
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
          })
      }
    }
  })

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})

// 路由拦截器
router.beforeEach((to, from, next) => {
    if (to.matched.length != 0) {
        if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
          let token = window.localStorage.token;
            if (Boolean(localStorage.getItem("userInfo")) && window.localStorage.token) { // 通过vuex state获取当前的user是否存在
              console.log("success")
                next();
            } else {
              console.log("fail")
                next({
                    path: '/login',
                    query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }

        } else {
            if (Boolean(localStorage.getItem("userInfo")) && window.localStorage.token) { // 判断是否登录
                if (to.path != "/" && to.path != "/login") { //判断是否要跳到登录界面
                  next()
                } else {
                    /**
                     * 防刷新，如果登录，修改路由跳转到登录页面，修改路由为登录后的首页
                     */
                    next({
                        path: '/goods/Goods'
                    })
                }
            } else {
                next();
            }
        }
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //使用store vuex状态管理
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})
