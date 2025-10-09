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

