import Vue from 'vue'

import Router from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import logIn from '../components/logIn.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'

Vue.use(Router)

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

const router = new Router({
  routes: [
    {
      path: '/',
      // name: logIn,
      redirect: '/login'
    },
    {
      path: '/login',
      // name: logIn,
      component: logIn
    },
    {
      path: '/home',
      // name: home,
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        }
      ]
    }
  ]
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  const tokenVal = window.sessionStorage.getItem('token')
  if (to.path === '/login') {
    return next()
  } else if (!tokenVal) {
    return next('/login')
  }
  next()
})

export default router
