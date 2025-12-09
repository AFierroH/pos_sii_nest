<p align="center">
<a href="#" target="blank"><img src="https://www.google.com/search?q=https://placehold.co/120x120/8E44AD/FFF%3Ftext%3DPOS-SII" width="120" alt="POS-SII Logo" /></a>
</p>

<p align="center">
<h1>Proyecto: Punto de Venta (POS) con Integración SII</h1>
</p>

<p align="center">
Una aplicación Full-Stack (NestJS + React) para la gestión de puntos de venta.
</p>

<p align="center">
<a href="#" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/backend-NestJS-red.svg" alt="Backend NestJS" /></a>
<a href="#" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/frontend-React%2520%252B%2520Vite-blue.svg" alt="Frontend React + Vite" /></a>
<a href="#" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/database-MySQL%2520%252B%2520Prisma-cyan.svg" alt="Database MySQL + Prisma" /></a>
<a href="#" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/status-En%2520Pruebas%2520(rama%2520tests)-yellow.svg" alt="Status" /></a>
<a href="#" target="_blank"><img src="https://www.google.com/search?q=https://img.shields.io/badge/license-MIT-blue.svg" alt="Package License" /></a>
</p>

Descripción

Este repositorio contiene la aplicación principal del Punto de Venta (POS), un sistema full-stack diseñado para la gestión de ventas, inventario, usuarios y la futura integración con el Servicio de Impuestos Internos (SII) de Chile.

Este proyecto sirve como el núcleo central que consume las librerías compartidas de frontend y backend, consolidando la lógica de negocio en una aplicación cohesiva.

Módulos y Características Principales

Gestión de Ventas: Creación de boletas/facturas, registro de ventas, múltiples formas de pago.

Control de Inventario: Gestión de producto, categoria. Control de stock en tiempo real.

Gestión de Usuarios: Autenticación y Autorización basada en Roles (admin, vendedor).

Módulo de Importación: Funcionalidad avanzada para importar datos masivos desde archivos SQL, incluyendo parseo, mapeo de columnas y carga en la base de datos (ver ImportModule).

Reportería: (Próximamente) Generación de reportes de ventas diarias, productos más vendidos, etc.

Arquitectura y Decisiones de Diseño

La arquitectura del proyecto se basa en un monorepo (gestionado localmente) que separa el backend (NestJS) y el frontend (Vite), pero los mantiene en el mismo repositorio para facilitar el desarrollo.

Una decisión de diseño clave fue externalizar la lógica común a librerías privadas, permitiendo que esta aplicación principal se enfoque en la orquestación y la lógica de negocio específica.

Componentes de la Arquitectura

/pos_sii_nest (Este Repositorio)
|
|-- /src (Backend - NestJS)
|   |-- /import (Módulo de Importación SQL)
|   |-- /ventas (Módulo de Ventas)
|   |-- /auth (Módulo de Autenticación)
|   |-- ...
|   `-- (Consume `nest_privado` para lógica común)
|
|-- /frontend (Frontend - Vite + React)
|   |-- /pages
|   |-- /components
|   `-- (Consume `vite_privado` para UI y hooks)
|
|-- (Dependencias Externas)
|   |
|   |-- Librería Backend: [AFierroH/nest_privado](https://github.com/AFierroH/nest_privado)
|   |   (Provee PrismaService, DTOs comunes, Guards)
|   |
|   `-- Librería Frontend: [AFierroH/vite_privado](https://github.com/AFierroH/vite_privado)
|       (Provee Componentes UI, Hooks de API, Instancia de Axios)


Justificación de Tecnologías

Backend (NestJS): Se eligió NestJS por su arquitectura modular y escalable (basada en Angular), su excelente integración con TypeScript y su sistema de Inyección de Dependencias, lo cual facilita la creación de aplicaciones robustas y mantenibles, ideal para un sistema POS.

Frontend (Vite + React): Se optó por Vite por su velocidad de desarrollo (HMR instantáneo) y React por su ecosistema maduro y su modelo de componentes, que se alinea perfectamente con la librería vite_privado.

Base de Datos (MySQL + Prisma): Se seleccionó MySQL por ser una base de datos relacional robusta y probada. Prisma se utiliza como ORM para garantizar la seguridad de tipos (Type-Safety) entre la base de datos y el código de NestJS, simplificando drásticamente las consultas y las migraciones.

Librerías Privadas (nest_privado, vite_privado): Esta fue una decisión de diseño estratégica para cumplir con el principio D.R.Y. (Don't Repeat Yourself) y sentar las bases para un futuro crecimiento (ej. una app móvil o un dashboard de admin separado) sin duplicar código.

Despliegue y Pruebas (Branch tests)

Este repositorio utiliza un flujo de Git estándar.

main: Versión estable (producción).

develop: Rama de integración para nuevas características.

tests: (Rama actual) Se utiliza para el desarrollo y prueba de características específicas, como el importador de datos SQL y la refactorización a librerías compartidas, antes de integrarlas a develop.

Configuración del Entorno de Desarrollo

Clonar los 3 repositorios en un mismo directorio:

git clone [https://github.com/AFierroH/pos_sii_nest.git](https://github.com/AFierroH/pos_sii_nest.git)
git clone [https://github.com/AFierroH/nest_privado.git](https://github.com/AFierroH/nest_privado.git)
git clone [https://github.com/AFierroH/vite_privado.git](https://github.com/AFierroH/vite_privado.git)


Instalar dependencias en los 3 proyectos (npm install).

"Enlazar" las dependencias privadas. Desde pos_sii_nest:

npm install ../nest_privado
npm install ./frontend/ ../vite_privado 
# (Asumiendo que vite_privado se instala dentro de la carpeta /frontend)


Configurar el backend (/pos_sii_nest):

Crear el archivo .env basado en .env.example.

Definir la DATABASE_URL.

Correr migraciones: npx prisma migrate dev

Ejecutar el proyecto:

# En /pos_sii_nest (para el backend)
npm run start:dev

# En /pos_sii_nest/frontend (para el frontend)
npm run dev


License

Este proyecto es MIT licensed.
