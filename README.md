<p align="center">
<a href="https://miposra.site" target="blank">
<img src="./logopos.png" width="150" alt="POS-SII Logo" />
</a>
</p>

<h1 align="center">POS Integrado: Sistema de Ventas con Facturación Electrónica (SII)</h1>

<p align="center">
Una solución Full-Stack (Web & Desktop) para la gestión integral de PyMEs en Chile, integrando control de hardware térmico y normativa tributaria.
</p>

<p align="center">
<a href="https://nestjs.com/" target="_blank">
<img src="https://img.shields.io/badge/Backend-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
</a>
<a href="https://vuejs.org/" target="blank">
<img src="https://img.shields.io/badge/Frontend-Vue.js_3+_Vite-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue.js" />
</a>
<a href="https://www.electronjs.org/" target="_blank">
<img src="https://img.shields.io/badge/Desktop-Electron-47848F?style=flat-square&logo=electron&logoColor=white" alt="Electron" />
</a>
<a href="https://www.mysql.com/" target="blank">
<img src="https://img.shields.io/badge/Database-MySQL+_Prisma-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
</a>
<a href="https://hii.sii.cl/" target="_blank">
<img src="https://img.shields.io/badge/Integración-SII_Chile-blue?style=flat-square" alt="SII Chile" />
</a>
</p>

📋 **Descripción del Proyecto**

Este repositorio aloja el desarrollo principal de mi Práctica Profesional, un sistema Punto de Venta (POS) robusto diseñado para cerrar la brecha tecnológica en las pequeñas y medianas empresas.

El sistema no es solo un gestor de inventario; es una suite de ingeniería de software que resuelve tres problemas críticos:

- **Integración de Hardware**: Comunicación nativa con impresoras térmicas (XPrinter) mediante protocolos ESC/POS vía USB y LAN.
- **Cumplimiento Tributario**: Emisión automática de Boletas Electrónicas válidas ante el SII (vía SimpleAPI), generando XMLs firmados y timbres electrónicos PDF417.
- **Arquitectura Híbrida**: Web + Escritorio con acceso a hardware.

---

🚀 **Demo en Producción**  
https://miposra.site

---

⚙️ **Arquitectura Técnica**

- **Backend**: NestJS (Node.js)
- **Frontend**: Vue 3 + Vite + TailwindCSS
- **Desktop**: Electron (USB nativo)
- **BD**: MySQL + Prisma

---

🛠️ **Instalación**

## 1. Prerrequisitos
- Node.js 18+
- MySQL
- Impresora ESC/POS (opcional)

---

## 2. Clonar Repositorios

```bash
# Crear carpeta contenedora
mkdir pos_system && cd pos_system

# Clonar núcleo y librerías
git clone https://github.com/AFierroH/pos_sii_nest.git
git clone https://github.com/AFierroH/nest_privado.git
git clone https://github.com/AFierroH/vite_privado.git
```

---

## 3. Instalar Dependencias

```bash
cd pos_sii_nest

# Instalar dependencias y enlazar librerías locales
npm install
npm install ../nest_privado
npm install ./frontend/ ../vite_privado
```

---

## 4. Configuración

Crea un archivo `.env`:

```env
DATABASE_URL="mysql://user:pass@localhost:3306/pos_db"
JWT_SECRET="tu_secreto_seguro"
SIMPLE_API_ENDPOINT="https://api.simpleapi.cl/..."
```

---

## 5. Ejecución

```bash
# Migrar base de datos
npx prisma migrate dev

# Backend
npm run start:dev

# Frontend
cd frontend
npm run dev

# Electron
npm run electron:dev
```

---

🔬 **Investigación y Desarrollo (I+D)**

### Python  
Pruebas rápidas con PyUSB y Tkinter para comandos ESC/POS.

### Pascal / Lazarus  
Utilidades LibUSB para pruebas de bajo nivel con kernel Windows.

### Node.js / Electron  
Implementación final con `node-usb`, `escpos`, dithering personalizado y soporte USB directo.

---

📄 **Licencia MIT**  
