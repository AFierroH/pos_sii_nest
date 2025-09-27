// Cliente Axios: define baseURL y helpers para llamar a la API NestJS.
// Cambia baseURL a la URL donde tengas corriendo tu Nest (ej http://localhost:3000/api).
import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})
api.interceptors.request.use(cfg=>{
  const t=localStorage.getItem('token'); if(t) cfg.headers.Authorization=`Bearer ${t}`;
  return cfg
})
export async function login(creds){ return api.post('/auth/login', creds) }
export async function fetchTopProducts(){ return api.get('/estadisticas/productos-mas-vendidos') }
export async function fetchSalesRange(inicio, fin){ return api.get(`/estadisticas/ingresos-por-fecha?inicio=${inicio}&fin=${fin}`) }
export async function fetchProducts(q=''){ return api.get(`/productos?search=${encodeURIComponent(q)}`) } // backend: implement endpoint
export async function emitirDte(payload){ return api.post('/dte/emitir', payload) }
export default api

// Funciones para conectar e imprimir con QZ Tray
export async function connectPrinter() {
  const qz = window.qz; // qz viene del script de QZ Tray
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
    console.log('Conectado a QZ Tray');
  }
}

export async function printTicket() {
  const qz = window.qz;
  await connectPrinter();

  const config = qz.configs.create("XP-80C"); // nombre exacto de la impresora
  var data = [
   { type: 'raw', format: 'image', flavor: 'file', data: 'assets/img/logo.png', options: { language: "ESCPOS", dotDensity: 'double' } },
   '\x1B' + '\x40',          // init
   '\x1B' + '\x61' + '\x31', // center align
   'Canastota, NY  13032' + '\x0A',
   '\x0A',                   // line break
   'http://qz.io' + '\x0A',     // text and line break
   '\x0A',                   // line break
   '\x0A',                   // line break
   'May 18, 2016 10:30 AM' + '\x0A',
   '\x0A',                   // line break
   '\x0A',                   // line break    
   '\x0A',
   'Transaction # 123456 Register: 3' + '\x0A',
   '\x0A',
   '\x0A',
   '\x0A',
   '\x1B' + '\x61' + '\x30', // left align
   'Baklava (Qty 4)       9.00' + '\x1B' + '\x74' + '\x13' + '\xAA', //print special char symbol after numeric
   '\x0A',
   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + '\x0A',       
   '\x1B' + '\x45' + '\x0D', // bold on
   'Here\'s some bold text!',
   '\x1B' + '\x45' + '\x0A', // bold off
   '\x0A' + '\x0A',
   '\x1B' + '\x61' + '\x32', // right align
   '\x1B' + '\x21' + '\x30', // em mode on
   'DRINK ME',
   '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A', // em mode off
   '\x0A' + '\x0A',
   '\x1B' + '\x61' + '\x30', // left align
   '------------------------------------------' + '\x0A',
   '\x1B' + '\x4D' + '\x31', // small text
   'EAT ME' + '\x0A',
   '\x1B' + '\x4D' + '\x30', // normal text
   '------------------------------------------' + '\x0A',
   'normal text',
   '\x1B' + '\x61' + '\x30', // left align
   '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A',
    '\x1D'+ '\x56' + '\x30',
   //   '\x1B' + '\x69',          // cut paper (old syntax)
// '\x1D' + '\x56'  + '\x00' // full cut (new syntax)
// '\x1D' + '\x56'  + '\x30' // full cut (new syntax)
// '\x1D' + '\x56'  + '\x01' // partial cut (new syntax)
// '\x1D' + '\x56'  + '\x31' // partial cut (new syntax)
//  '\x10' + '\x14' + '\x01' + '\x00' + '\x05',  // Generate Pulse to kick-out cash drawer**
                                                // **for legacy drawer cable CD-005A.  Research before using.
// Star TSP100-series kick-out ONLY
// '\x1B' + '\x70' + '\x00' /* drawer 1 */ + '\xC8' + '\xC8' + '\x1B' + '\x1F' + '\x70' + '\x03' + '\x00',
// '\x1B' + '\x70' + '\x01' /* drawer 2 */ + '\xC8' + '\xC8' + '\x1B' + '\x1F' + '\x70' + '\x03' + '\x00',
   ];

  await qz.print(config, data).catch(function(e) { console.error(e); });
  console.log('Impresión enviada');
  return { ok: true };
}

