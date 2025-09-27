// Router SPA sin duplicar MainLayout
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Estadisticas from '../pages/Estadisticas.vue'
import Ventas from '../pages/Ventas.vue'
import Productos from '../pages/Productos.vue'
import Configuracion from '../pages/Configuracion.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/estadisticas', component: Estadisticas },
  { path: '/ventas', component: Ventas },
  { path: '/productos', component: Productos },
  { path: '/config', component: Configuracion }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
