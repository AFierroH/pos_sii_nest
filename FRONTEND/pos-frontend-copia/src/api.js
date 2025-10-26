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
export async function fetchTopProducts() { return api.get('/estadisticas/productos-mas-vendidos') }
export async function fetchSalesRange(inicio, fin) { return api.get(`/estadisticas/ingresos-por-fecha?inicio=${inicio}&fin=${fin}`) }

export async function addProduct(data) { return api.post('/productos', data) }
export async function updateProduct(id, data) { return api.put(`/productos/${id}`, data) }
export async function deleteProduct(id) { return api.delete(`/productos/${id}`) }
export async function agregarStockApi(id, cantidad) {return api.post(`/productos/${id}/agregar-stock`, { cantidad })}
export async function quitarStockApi(id, cantidad) {return api.post(`/productos/${id}/quitar-stock`, { cantidad })}

export async function fetchUsers() { return api.get('/usuarios') }
export async function createUser(data) { return api.post('/usuarios', data) }
export async function updateUser(id, data) { return api.put(`/usuarios/${id}`, data) }
export async function deleteUser(id) { return api.delete(`/usuarios/${id}`) }
export async function fetchProducts(q=''){ return api.get(`/productos?search=${encodeURIComponent(q)}`) } 
export async function emitirDte(payload){ return api.post('/dte/emitir', payload) }
export async function emitirVenta(payload) {
  return fetch('/ventas/emitir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => res.json());
}
export default api
