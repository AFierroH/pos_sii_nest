<!-- Sidebar: lista larga de opciones; emite selección al padre -->
<template>
  <aside class="w-1/5 max-w-[300px] bg-[var(--panel)] border-r border-gray-800 p-4 flex flex-col">
    <div class="mb-6">
      <div class="text-lg font-bold text-white">MiEmpresa</div>
      <div class="text-xs text-[var(--muted)]">Cuenta Demo</div>
    </div>

    <nav class="flex-1 overflow-auto">
      <template v-for="item in items" :key="item.key">
        <button @click="$router.push(item.route)"
          class="w-full text-left px-3 py-2 rounded mb-1 text-[var(--muted)] hover:bg-[var(--accent)] hover:text-black transition">
          {{ item.title }}
        </button>
      </template>
    </nav>

    <div class="mt-4 text-xs text-[var(--muted)]">
      <div class="mb-2">Atajos</div>
      <div>• Ctrl+P: Imprimir</div>
    </div>
  </aside>
</template>

<script setup>
const items = [
  { key:'dashboard', title:'Dashboard', route:'/dashboard' },
  { key:'ventas', title:'Ventas', route:'/ventas' },
  { key:'productos', title:'Productos', route:'/productos' },
  { key:'estadisticas', title:'Estadísticas', route:'/estadisticas' },
  { key:'config', title:'Configuración', route:'/config' },
  { key:'impresora', title:'Prueba', route:'/impresora' }
]
</script>
