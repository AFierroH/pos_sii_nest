// Pequeño store local para usuario/token (sin Pinia, simple JS module).
// Mantiene token y user y helpers login/logout para facilitar la integración.
export const auth = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  setSession(user, token){
    this.user = user; this.token = token;
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  },
  clear(){ this.user=null; this.token=null; localStorage.removeItem('user'); localStorage.removeItem('token') }
}
