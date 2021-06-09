import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/watchlist',
    name: 'Watching',
    component:() => import('@/views/Watching')
  },
  {
    path: '/SubmitBirdQuery',
    name: 'SubmitBirdQuery',
    component:() => import('@/views/SubmitBirdQuery')
  },
  {
    path: '/BirdRecommendations',
    name: 'BirdRecommendations',
    component: () => import('@/views/BirdRecommendations')
  },
  {
    path: '/ViewRarities',
    name: 'ViewRarities',
    component: () => import('@/views/ViewRarities')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile')
  },
  {
    path: '/nodata',
    name: 'nodata',
    component: () => import('@/views/nodata')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
