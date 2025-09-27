<!-- Zona de Ventas: scanner input (keyboard wedge), producto listado y carrito POS -->
<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2">
      <div class="p-4 bg-[var(--panel)] rounded mb-4">
        <div class="flex items-center gap-3">
          <input v-model="scan" @keyup.enter="handleScanEnter" placeholder="Escanea código o ingresa SKU" class="p-2 bg-[#081026] rounded w-1/2 text-white"/>
          <button @click="handleScanEnter" class="px-3 py-2 bg-[var(--accent)] rounded text-black">Añadir</button>
        </div>
      </div>

      <div class="p-4 bg-[var(--panel)] rounded">
        <h3 class="mb-2">Productos</h3>
        <input v-model="q" @input="search" placeholder="Buscar productos..." class="w-full p-2 mb-3 bg-[#081026] rounded text-white"/>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="p in productos" :key="p.id_producto" class="p-3 bg-[#071226] rounded">
            <div class="font-medium">{{p.nombre}}</div>
            <div class="text-sm text-[var(--muted)]">${{p.precio}}</div>
            <button class="mt-2 px-2 py-1 bg-[var(--accent)] text-black rounded" @click="addProduct(p)">Añadir</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="p-4 bg-[var(--panel)] rounded mb-4">
        <h3 class="mb-2">Carrito</h3>
        <div v-for="(it,i) in cart" :key="i" class="flex justify-between py-2 border-b border-gray-800">
          <div>{{it.nombre}} x{{it.cantidad}}</div>
          <div>${{it.subtotal}}</div>
        </div>
        <div class="mt-4 text-right font-semibold">Total: ${{total}}</div>
        <div class="mt-3 flex gap-2">
          <button class="px-3 py-2 rounded bg-green-500" @click="checkout">Pagar</button>
          <button class="px-3 py-2 rounded bg-gray-600" @click="clear">Limpiar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchProducts, emitirDte } from '../api'

const scan = ref(''), q=ref(''), productos=ref([]), cart=ref([])
async function search(){ 
  try{ const r = await fetchProducts(q.value); productos.value = r.data }
  catch{ productos.value = [{id_producto:1,nombre:'Demo',precio:1500}] }
}
function handleScanEnter(){
  const code = scan.value.trim(); if(!code) return;
  // intentar encontrar producto por barcode en productos
  const p = productos.value.find(x=>x.codigo_barra==code || String(x.id_producto)==code)
  if(p) addProduct(p)
  else {
    // fallback: buscar en API por barcode (no implementado), aquí simular
    addProduct({ id_producto: 999, nombre: `Escaneado ${code}`, precio: 1000})
  }
  scan.value = ''
}
function addProduct(p){
  const idx = cart.value.findIndex(x=>x.id_producto===p.id_producto)
  if(idx>=0){ cart.value[idx].cantidad++; cart.value[idx].subtotal = cart.value[idx].cantidad*p.precio }
  else cart.value.push({ ...p, cantidad:1, subtotal:p.precio })
}
function clear(){ cart.value = [] }
function checkout(){
  const detalles = cart.value.map(i=>({ id_producto: i.id_producto, cantidad: i.cantidad, precio_unitario: i.precio }))
  emitirDte({ id_usuario:1, id_empresa:1, total: cart.value.reduce((a,b)=>a+b.subtotal,0), detalles }).then(()=>{ alert('Emitido DTE (simulado)'); clear() })
}
onMounted(search)
const total = computed(()=>cart.value.reduce((a,b)=>a+b.subtotal,0))
</script>
