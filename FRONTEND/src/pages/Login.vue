<!-- Login page: realiza llamada login y guarda sesión; si demo usa auth.setSession -->
<template>
  <div class="flex items-center justify-center h-screen">
    <div class="w-full max-w-md bg-[var(--panel)] p-8 rounded shadow">
      <h2 class="text-2xl font-semibold mb-4">Iniciar sesión</h2>
      <form @submit.prevent="doLogin" class="space-y-3">
        <input v-model="email" placeholder="email" class="w-full p-2 bg-[#081026] rounded border border-gray-800 text-white"/>
        <input type="password" v-model="password" placeholder="contraseña" class="w-full p-2 bg-[#081026] rounded border border-gray-800 text-white"/>
        <div class="flex justify-between items-center">
          <button class="bg-[var(--accent)] text-black px-4 py-2 rounded">Entrar</button>
          <button type="button" @click="demo">Demo</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { login } from '../api'
import { auth } from '../store/auth'
const router = useRouter()
let email=''; let password='';
async function doLogin(){
  try {
    const res = await login({ email, password })
    const tok = res.data.access_token || res.data.token
    const user = { email } // ideally backend returns user
    auth.setSession(user, tok)
    router.push('/')
  } catch(e){
    alert('login failed, using demo')
    auth.setSession({ email:'demo' }, 'demo-token')
    router.push('/')
  }
}
function demo(){ auth.setSession({ email:'demo' }, 'demo-token'); router.push('/') }
</script>
