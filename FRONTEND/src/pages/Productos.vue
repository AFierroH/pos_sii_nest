<!-- Página Productos: llama al endpoint /productos y muestra listado con búsqueda 
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
 -->

<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-xl font-semibold">Prueba de impresión</h2>

      <div class="flex gap-2 items-center">
        <button
          @click="loadPrinters"
          class="bg-[var(--accent)] px-3 py-2 rounded text-black font-semibold hover:opacity-90"
        >
          Listar impresoras
        </button>

        <select v-model="selectedPrinter" class="p-2 rounded bg-[#081026] text-white">
          <option disabled value="">Seleccione impresora</option>
          <option v-for="p in printers" :key="p" :value="p">{{ p }}</option>
        </select>

        <button
          @click="printTest"
          class="bg-[var(--accent)] px-3 py-2 rounded text-black font-semibold hover:opacity-90"
          :disabled="!selectedPrinter"
        >
          Imprimir Ticket
        </button>
      </div>
    </div>

    <p v-if="status" class="mt-4" :class="status.ok ? 'text-green-400' : 'text-red-400'">
      {{ status.ok ? 'Impreso correctamente' : 'Error: ' + status.error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { emitirDte } from '../api'

const status = ref(null)
const printers = ref([])
const selectedPrinter = ref("")

// Cargar impresoras desde QZ Tray
async function loadPrinters() {
  try {
    const qz = window.qz
    if (!qz) throw new Error("QZ Tray no está cargado")
    if (!qz.websocket.isActive()) await qz.websocket.connect()

    printers.value = await qz.printers.find()
    console.log("Impresoras disponibles:", printers.value)
  } catch (err) {
    console.error("Error listando impresoras:", err)
    printers.value = []
  }
}

// Función de impresión usando la impresora seleccionada y backend
async function printTest() {
  status.value = { ok: null } // reset
  try {
    const qz = window.qz
    if (!qz) throw new Error("QZ Tray no está cargado")
    if (!qz.websocket.isActive()) await qz.websocket.connect()

    // Pedir ticket al backend
    const resp = await emitirDte({ test: true })
    const { printer, data } = resp.data

    // Si el usuario seleccionó otra impresora, la usamos
    const impresora = selectedPrinter.value || printer

    const config = qz.configs.create(impresora)
    await qz.print(config, data)

    status.value = { ok: true }
  } catch (err) {
    console.error("Error al imprimir:", err)
    status.value = { ok: false, error: err.message }
  }
}
</script>
