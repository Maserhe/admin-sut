import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import HomePage from '../components/HomePage.vue'
import Class from '../components/Class.vue'
import Resource from '../components/Resource.vue'
import UserInfo from '../components/UserInfo.vue'
import ModifyInfo from '../components/ModifyInfo.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: '/home/homePage',
  },

  {
    path: '/login',
    name: 'Login', 
    component: Login
  },

  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [
      {
        path: 'homePage',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
        name: 'HomePage',
        component: HomePage
      },
      {
        path: 'class',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
        name: 'Class',
        component: Class,
      },
      {
        path: 'resource',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
        name: 'Resource',
        component: Resource,
      },
      {
        path: 'userinfo',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
        name: 'UserInfo',
        component: UserInfo,
      },
      {
        path: 'modifyinfo',
        name: 'ModifyInfo',
        component: ModifyInfo,
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
