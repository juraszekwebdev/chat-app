import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '../views/SignIn'
import SignUp from '../views/SignUp'
import store from '../store';
import Dashboard from "@/views/Dashboard";
import {auth} from "@/api/firebase";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/sign-in',
    name: 'Sign In',
    component: SignIn,
    meta: {
      requiresAuth: false
    },
  },
  {
    path: '/sign-up',
    name: 'Sign Up',
    component: SignUp,
    meta: {
      requiresAuth: false
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    auth.onAuthStateChanged((response) => {
      if (!response) {
        localStorage.removeItem("user");
        next('/sign-in');
      }
    })
    if (store.getters.isLoggedIn) {
      next();
    } else {
      next('/sign-in');
    }
  } else {
    next();
  }
});

export default router
