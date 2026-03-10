import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import SongDetail from '../views/SongDetail.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/song/:id',
    name: 'SongDetail',
    component: SongDetail,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('kapela_loggedIn') === 'true'
  
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login')
  } else if (to.name === 'Login' && loggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
