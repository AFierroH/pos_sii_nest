<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2">
      <!-- Panel de búsqueda y carrito -->
      <div class="p-4 bg-[var(--panel)] rounded mb-4">
        <div class="flex items-center gap-3">
          <input
            v-model="scan"
            @keyup.enter="handleScanEnter"
            placeholder="Escanea código o ingresa SKU"
            class="p-2 bg-[#081026] rounded w-1/2 text-white"
          />
          <button @click="handleScanEnter" class="px-3 py-2 bg-[var(--accent)] rounded text-black">
            Añadir
          </button>

          <div class="ml-auto flex items-center gap-2">
            <button @click="loadPrinters" class="px-3 py-2 bg-[var(--accent)] rounded text-black">
              Listar impresoras
            </button>
            <select v-model="selectedPrinter" class="p-2 rounded bg-[#081026] text-white">
              <option value="">(usar impresora por defecto)</option>
              <option v-for="p in printers" :key="p" :value="p">{{ p }}</option>
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
        <input
          v-model="q"
          @input="search"
          placeholder="Buscar productos..."
          class="w-full p-2 mb-3 bg-[#081026] rounded text-white"
        />
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="p in productos"
            :key="p.id_producto"
            class="p-3 bg-[#071226] rounded"
          >
            <div class="font-medium">{{ p.nombre }}</div>
            <div class="text-sm text-[var(--muted)]">${{ p.precio }}</div>
            <button
              class="mt-2 px-2 py-1 bg-[var(--accent)] text-black rounded"
              @click="addProduct(p)"
            >
              Añadir
            </button>
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
          <img :src="'data:image/png;base64,' + ventaResult.pdf417Base64" class="border border-white" />
        </div>

        <!-- Preview ticket entero -->
        <div
          v-if="ventaResult && !usarImpresora"
          class="mt-6 p-4 bg-white text-black font-mono text-sm rounded shadow"
        >
          <h4 class="mb-2 font-bold">Ticket (preview)</h4>

          <div v-if="ventaResult.boletaBase64">
            <img
              :src="'data:image/png;base64,' + ventaResult.boletaBase64"
              class="mx-auto border my-2"
            />
          </div>

          <div v-else>
            <div v-for="(line, i) in ventaResult.ticket" :key="i">
              <img
                v-if="typeof line === 'object' && line.type === 'image'"
                :src="line.data"
                class="mx-auto my-2"
              />
              <div v-else>{{ line }}</div>
            </div>
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

// Buscar productos
async function search(){ 
  try{ const r = await fetchProducts(q.value); productos.value = r.data }
  catch{ productos.value = [] }
}

// Cargar impresoras del sistema (Electron)
async function loadPrinters() {
  try {
    const list = await window.electronAPI.listSystemPrinters()
    printers.value = list.map(p => p.name)
  } catch (e) {
    console.error('loadPrinters', e)
    printers.value = []
  }
}

// Escanear código o SKU
async function handleScanEnter() {
  if (!scan.value) return
  const term = scan.value.trim()
  const data = await fetchProducts(term)
  if (data && data.length > 0) addProduct(data[0])
  scan.value = ''
}

// Añadir producto al carrito
function addProduct(p) {
  const found = cart.value.find(it => it.id_producto === p.id_producto)
  if (found) {
    found.cantidad++
    found.subtotal = found.cantidad * p.precio
  } else {
    cart.value.push({ ...p, cantidad: 1, subtotal: p.precio })
  }
}

function clear() {
  cart.value = []
  ventaResult.value = null
}

// Calcular total
const total = computed(() => cart.value.reduce((a, b) => a + b.subtotal, 0))

// Emitir boleta o ticket
async function checkout() {
  if (cart.value.length === 0) return alert('Carrito vacío')
  const detalles = cart.value.map(i => ({
    id_producto: i.id_producto,
    cantidad: i.cantidad,
    precio_unitario: i.precio,
    nombre: i.nombre
  }))
  try {
    const payload = {
      productos: cart.value.map(it => ({
        id: it.id_producto,
        cantidad: it.cantidad
      })),
      total: total.value,
      detalles,
      usarImpresora: usarImpresora.value,
      impresora: selectedPrinter.value
    }

    const data = await emitirDte(payload)
    ventaResult.value = data
    alert('Venta emitida correctamente')

    if (usarImpresora.value && window.electronAPI?.printBase64) {
      await window.electronAPI.printBase64(
        selectedPrinter.value,
        data.boletaBase64
      )
    }
  } catch (e) {
    console.error('Error al emitir DTE:', e)
    alert('Error al procesar venta')
  }
}

onMounted(search)
</script>
