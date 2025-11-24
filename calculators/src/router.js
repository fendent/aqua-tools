import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import WaterChangeModel from './calculators/water-change/WaterChangeModel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/calculators/water-change',
    name: 'WaterChange',
    component: WaterChangeModel
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
