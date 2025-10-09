// Arranque app: crea Vue, monta router y aplica tema guardado en localStorage.
// Importa style.css (Tailwind v4).
import { createApp } from 'vue'
import App from './pages/MainLayout.vue' // MainLayout actuará como root con <router-view>
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Aplicar tema guardado
const theme = localStorage.getItem('theme') || 'dark'
if(theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark')
