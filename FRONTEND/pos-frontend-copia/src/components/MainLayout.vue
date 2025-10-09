<template>
  <div class="min-h-screen flex">
    <Sidebar :active="active" @select="active = $event" class="w-1/5 max-w-[260px]" />
    <main class="flex-1 p-6">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Panel Principal</h2>
        <div class="flex items-center gap-4">
          <button @click="logout" class="text-sm text-muted hover:text-white">Cerrar sesión</button>
        </div>
      </div>

      <div v-if="active==='estadisticas'">
        <StatsPanel :tenantId="tenantId"/>
      </div>

      <div v-else class="bg-[#07121b] rounded p-6 text-muted">
        <p>Vista: {{ active }} (componente no implementado aún)</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import StatsPanel from './StatsPanel.vue'

const active = ref('estadisticas')
const tenantId = 1 // en login real sustituir por user.id_empresa

// logout demo
function logout(){
  localStorage.removeItem('token')
  // recargar app para volver a login
  location.reload()
}

// listen for global login event (from LoginForm demo)
onMounted(()=>{
  window.__ON_LOGIN_UI__ = (payload) => {
    // payload.user.id_empresa -> set tenant
    if (payload && payload.user && payload.user.id_empresa) tenantId = payload.user.id_empresa
    // store token
    if (payload.token) localStorage.setItem('token', payload.token)
  }
})
</script>

<style scoped>
/* no extra */
</style>
