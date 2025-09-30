<template>
  <div>
    <div class="mb-4 flex justify-between">
      <h2 class="text-xl font-semibold">Productos</h2>
      <button class="bg-[var(--accent)] px-3 py-2 rounded text-black">Nuevo Producto</button>
    </div>
    <div class="bg-[var(--panel)] p-4 rounded">
      <input v-model="q" @input="load" placeholder="Buscar..." class="w-full p-2 bg-[#081026] rounded text-white mb-4"/>
      <div v-for="p in productos" :key="p.id_producto" class="flex justify-between border-b border-gray-800 py-2">
        <div>{{p.nombre}}</div>
        <div>${{p.precio}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchProducts } from '../api'
const productos = ref([]), q = ref('')
async function load(){
  try{ const r = await fetchProducts(q.value); productos.value = r.data } catch{ productos.value = [{id_producto:1,nombre:'Demo',precio:1500}] }
}
onMounted(load)
</script>
