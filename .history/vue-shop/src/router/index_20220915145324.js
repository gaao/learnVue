import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import logIn from '../components/logIn.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

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
const routes = [
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
    component: Home
  }
]

//挂载导航守卫
routes.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();
  }
  const tokenVal = window.localStorage.getItem('token')
  if (!tokenVal) {
    return next('/login');
  }
  next()
})

export default new VueRouter({
  routes
})
