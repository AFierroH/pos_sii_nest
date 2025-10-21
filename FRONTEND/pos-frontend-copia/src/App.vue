<!-- <template>
  <div class="min-h-screen bg-[#071025] text-gray-100">
    <component :is="user ? 'MainLayout' : 'LoginForm'" @login="handleLogin"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import MainLayout from './components/MainLayout.vue'

const user = ref(localStorage.getItem('token') ? { name: 'demo' } : null)

function handleLogin(payload) {
  user.value = payload.user
  localStorage.setItem('token', payload.token || 'demo-token')
}
</script>
 -->
<template>
  <div class="min-h-screen bg-[#071025] text-gray-100">
    <component :is="user ? MainLayout : LoginForm" :user="user" @login="handleLogin"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import MainLayout from './components/MainLayout.vue'

const user = ref(null)

function handleLogin(payload) {
  user.value = payload.user
}
</script>