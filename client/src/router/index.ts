import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import form from '../views/form.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/form',
      name: 'form',
      component: form,
    },
  ],
})

export default router
