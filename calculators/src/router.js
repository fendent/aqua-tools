import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import WaterChangeModel from './calculators/water-change/WaterChangeModel.vue'
import DiyDosingCalculator from './calculators/diy-dosing/DiyDosingCalculator.vue'
import DosingTargetCalculator from './calculators/dosing-target/DosingTargetCalculator.vue'

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
  },
  {
    path: '/calculators/diy-dosing',
    name: 'DiyDosing',
    component: DiyDosingCalculator
  },
  {
    path: '/calculators/dosing-target',
    name: 'DosingTarget',
    component: DosingTargetCalculator
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
