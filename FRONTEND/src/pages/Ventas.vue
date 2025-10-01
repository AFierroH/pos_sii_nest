<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2">
      <!-- Panel de búsqueda y carrito -->
      <div class="p-4 bg-[var(--panel)] rounded mb-4">
        <div class="flex items-center gap-3">
          <input v-model="scan" @keyup.enter="handleScanEnter" placeholder="Escanea código o ingresa SKU" class="p-2 bg-[#081026] rounded w-1/2 text-white"/>
          <button @click="handleScanEnter" class="px-3 py-2 bg-[var(--accent)] rounded text-black">Añadir</button>

          <div class="ml-auto flex items-center gap-2">
            <button @click="loadPrinters" class="px-3 py-2 bg-[var(--accent)] rounded text-black">Listar impresoras</button>
            <select v-model="selectedPrinter" class="p-2 rounded bg-[#081026] text-white">
              <option value="">(usar impresora por defecto)</option>
              <option v-for="p in printers" :key="p" :value="p">{{p}}</option>
            </select>
            <label class="flex items-center gap-1 text-white ml-2">
              <input type="checkbox" v-model="usarImpresora" />
              Usar impresora
            </label>
          </div>
        </div>
      </div>

      <!-- Listado de productos -->
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

    <!-- Panel de carrito + ticket -->
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

        <!-- Preview PDF417 simple -->
        <div v-if="ventaResult && ventaResult.pdf417Base64" class="mt-4">
          <h4 class="text-white mb-2">PDF417 (preview)</h4>
          <img :src="'data:image/png;base64,' + ventaResult.pdf417Base64" class="border border-white"/>
        </div>

        <!-- Preview ticket entero -->
        <div v-if="ventaResult && !usarImpresora" class="mt-6 p-4 bg-white text-black font-mono text-sm rounded shadow">
          <h4 class="mb-2 font-bold">Ticket (preview)</h4>
          <div v-for="(line,i) in ventaResult.ticket" :key="i">
            <!-- si es imagen -->
            <img v-if="typeof line === 'object' && line.type === 'image'" :src="line.data" class="mx-auto my-2"/>
            <!-- si es texto -->
            <div v-else>{{ line }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchProducts, emitirDte } from '../api'

const scan = ref('')
const q = ref('')
const productos = ref([])
const cart = ref([])
const printers = ref([])
const selectedPrinter = ref('')
const usarImpresora = ref(true)
const ventaResult = ref(null)

async function loadPrinters(){
  try{
    const qz = window.qz
    if(!qz) throw new Error('QZ Tray no disponible')
    if(!qz.websocket.isActive()) await qz.websocket.connect()
    printers.value = await qz.printers.find()
  }catch(e){
    console.error('loadPrinters', e); printers.value = []
  }
}

async function search(){ 
  try{ const r = await fetchProducts(q.value); productos.value = r.data }
  catch{ productos.value = [] }
}

function handleScanEnter(){
  const code = scan.value.trim(); if(!code) return;
  const p = productos.value.find(x=>x.codigo_barra==code || String(x.id_producto)==code)
  if(p) addProduct(p)
  else addProduct({ id_producto: 0, nombre: `Escaneado ${code}`, precio: 0 })
  scan.value = ''
}

function addProduct(p){
  const idx = cart.value.findIndex(x=>x.id_producto===p.id_producto)
  if(idx>=0){ cart.value[idx].cantidad++; cart.value[idx].subtotal = cart.value[idx].cantidad * p.precio }
  else cart.value.push({ ...p, cantidad:1, subtotal: p.precio })
}

function clear(){ cart.value = []; ventaResult.value = null }

const total = computed(()=>cart.value.reduce((a,b)=>a+b.subtotal,0))

async function checkout(){
  if(cart.value.length===0){ alert('Carrito vacío'); return; }

  const detalles = cart.value.map(i=>({
    id_producto: i.id_producto,
    cantidad: i.cantidad,
    precio_unitario: i.precio
  }))

  try {
    const resp = await emitirDte({ 
      id_usuario: 1, 
      id_empresa: 1, 
      total: total.value, 
      detalles,
      usarImpresora: usarImpresora.value
    })
    const { ticket, pdf417Base64, tedXml, venta } = resp.data
    ventaResult.value = { ticket, pdf417Base64, venta }

    // imprimir con QZ Tray solo si usarImpresora
    if(usarImpresora.value && window.qz){
      const qz = window.qz
      if(!qz.websocket.isActive()) await qz.websocket.connect()
      const impresora = selectedPrinter.value || (await qz.printers.find())
      const cfg = qz.configs.create(impresora)
      await qz.print(cfg, ticket)
    }

    // opcional: descargar XML
    const blob = new Blob([tedXml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `TED_${venta.id_venta}.xml`; a.click()
    URL.revokeObjectURL(url)

    alert('Venta registrada' + (usarImpresora.value ? ' y ticket enviado a la impresora' : ''))
    clear()
  } catch (err) {
    console.error('checkout error', err)
    alert('Error al emitir DTE')
  }
}

onMounted(search)
</script>
