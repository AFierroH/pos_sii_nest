<p align="center">
<a href="https://miposra.site" target="blank">
<!-- Opción A: Asegúrate de tener logo.png en la raíz de tu repo -->
<img src="./logo.png" width="150" alt="POS-SII Logo" />
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
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Frontend-Vue.js_3+_Vite-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue.js" />
</a>
<a href="https://www.electronjs.org/" target="_blank">
<img src="https://img.shields.io/badge/Desktop-Electron-47848F?style=flat-square&logo=electron&logoColor=white" alt="Electron" />
</a>
<a href="https://www.mysql.com/" target="blank">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Database-MySQL+_Prisma-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
</a>
<a href="https://hii.sii.cl/" target="_blank">
<img src="https://img.shields.io/badge/Integración-SII_Chile-blue?style=flat-square" alt="SII Chile" />
</a>
</p>

📋 Descripción del Proyecto

Este repositorio aloja el desarrollo principal de mi Práctica Profesional, un sistema Punto de Venta (POS) robusto diseñado para cerrar la brecha tecnológica en las pequeñas y medianas empresas.

El sistema no es solo un gestor de inventario; es una suite de ingeniería de software que resuelve tres problemas críticos:

Integración de Hardware: Comunicación nativa con impresoras térmicas (XPrinter) mediante protocolos ESC/POS vía USB y LAN.

Cumplimiento Tributario: Emisión automática de Boletas Electrónicas válidas ante el SII (vía SimpleAPI), generando XMLs firmados y timbres electrónicos PDF417.

Arquitectura Híbrida: Funciona como aplicación Web (para administración remota) y como aplicación de Escritorio (Electron) para el punto de venta físico con acceso a hardware.

🚀 Demo en Vivo (Producción)

El sistema se encuentra desplegado y funcional. Puedes probarlo registrando una cuenta nueva (role user/vendedor por defecto).

🔗 URL: https://miposra.site

⚙️ Arquitectura Técnica

El proyecto utiliza una arquitectura de Monorepo Híbrido, consumiendo librerías privadas compartidas para mantener el principio DRY (Don't Repeat Yourself).

Stack Tecnológico

Backend: NestJS (Node.js) - Arquitectura modular, Guards, DTOs y Servicios.

Frontend: Vue 3 + Vite + TailwindCSS - Interfaz reactiva y rápida.

Desktop: Electron - Wrapper para acceso nativo a puertos USB (WinUSB/Libusb).

Base de Datos: MySQL gestionado con Prisma ORM.

Módulos Principales

Ventas & Caja: Interfaz optimizada para pantallas táctiles, carrito reactivo y cálculos en tiempo real.

Integración SII: Generación de DTEs, firma digital y renderizado de Timbre Electrónico (PDF417) optimizado para impresión térmica (algoritmos de binarización).

Gestión de Hardware (I+D):

Implementación de drivers personalizados para impresoras XPrinter.

Pruebas de concepto realizadas en Python (PyUSB) y Lazarus Pascal (LibUsb) para ingeniería inversa de protocolos.

Inventario & Usuarios: RBAC (Role Based Access Control) y carga masiva de datos SQL.

🛠️ Instalación y Entorno Local

Para replicar el entorno de desarrollo, necesitarás clonar este repositorio y las librerías satélite.

1. Prerrequisitos

Node.js v18+

MySQL

Impresora Térmica (Opcional, compatible con protocolo ESC/POS)

2. Clonar Repositorios

# Crear carpeta contenedora
mkdir pos_system && cd pos_system

# Clonar núcleo y librerías
git clone [https://github.com/AFierroH/pos_sii_nest.git](https://github.com/AFierroH/pos_sii_nest.git)
git clone [https://github.com/AFierroH/nest_privado.git](https://github.com/AFierroH/nest_privado.git)
git clone [https://github.com/AFierroH/vite_privado.git](https://github.com/AFierroH/vite_privado.git)


3. Instalación de Dependencias

cd pos_sii_nest

# Instalar dependencias raíz y enlazar librerías locales
npm install
npm install ../nest_privado
npm install ./frontend/ ../vite_privado 


4. Configuración

Crea un archivo .env en la raíz basado en .env.example:

DATABASE_URL="mysql://user:pass@localhost:3306/pos_db"
JWT_SECRET="tu_secreto_seguro"
SIMPLE_API_ENDPOINT="[https://api.simpleapi.cl/](https://api.simpleapi.cl/)..."


5. Ejecución

# Migrar base de datos
npx prisma migrate dev

# Iniciar Backend (NestJS)
npm run start:dev

# Iniciar Frontend (Vite)
cd frontend
npm run dev

# Iniciar Electron (Opcional, modo escritorio)
npm run electron:dev


🔬 Investigación y Desarrollo (I+D)

Durante la práctica profesional se realizaron pruebas exhaustivas de integración de hardware para superar las limitaciones de los navegadores web.

Python: Scripts de prueba con PyUSB y Tkinter para validación rápida de comandos ESC/POS y manipulación de imágenes bit-a-bit.

Lazarus / Pascal: Desarrollo de utilidades nativas de bajo nivel para comunicación directa con el Kernel de Windows (WinUSB) y solución de conflictos de drivers.

Node.js / Electron: Implementación final usando node-usb y escpos con un algoritmo personalizado de dithering para imprimir logos y códigos QR de alta velocidad sin cortar el papel.

📄 Licencia

Este proyecto está bajo la licencia MIT.
