import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Form from '../views/form.vue'
import FormTest from '../views/formTest.vue'
import BaseFormView from '../views/BaseFormView.vue'

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
      component: Form,
    },
    {
      path: '/formTest',
      name: 'formTest',
      component: FormTest,
    },
    {
      path: '/BaseFormView',
      name: 'BaseFormView',
      component: BaseFormView,
    }
  ],
})

export default router
