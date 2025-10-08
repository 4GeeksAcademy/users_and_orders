# 🚀 Users & Orders - Sistema de Gestión Fullstack

> **Aplicación completa de gestión de usuarios y pedidos** construida con React, Flask, SQLAlchemy y Bootstrap.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask)](https://flask.palletsprojects.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.x-red?logo=python)](https://www.sqlalchemy.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)](https://getbootstrap.com/)

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Funcionalidades Extra](#-funcionalidades-extra-implementadas)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Deploy](#-deploy)

---

## ✨ Características Principales

### ✅ **Requisitos Obligatorios Completados**

#### Backend (Flask + SQLAlchemy)

- ✅ **CRUD Completo de Usuarios y Pedidos**
- ✅ **Modelos con ORM (SQLAlchemy)**
  - `User`: id, name, email (único, validado), created_at
  - `Order`: id, user_id (FK), product_name, amount, created_at
- ✅ **Endpoints RESTful**
  - `POST /api/users` - Crear usuario
  - `GET /api/users` - Listar usuarios (con paginación)
  - `POST /api/orders` - Crear pedido
  - `GET /api/orders` - Listar pedidos (con join)
  - `GET /api/users/<id>/orders` - Pedidos por usuario
- ✅ **Validaciones Robustas**
  - Email único y formato válido
  - Amount > 0
  - User_id existente en pedidos
- ✅ **Base de Datos Relacional**
  - SQLite/Postgres con SQLAlchemy
  - Migraciones con Flask-Migrate

#### Frontend (React + Bootstrap)

- ✅ **Diseño Responsivo con Bootstrap 5.3**
- ✅ **Pantalla de Usuarios**
  - Formulario de creación (nombre + email)
  - Listado paginado de usuarios
  - Botón para ver pedidos por usuario
- ✅ **Pantalla de Pedidos**
  - Formulario con selector de usuario
  - Lista de pedidos con información del usuario
- ✅ **Manejo de Estados y Errores**
  - Loading spinners durante operaciones
  - Mensajes de error descriptivos
  - Validación en tiempo real
- ✅ **Rutas con React Router**
  - `/users` - Gestión de usuarios
  - `/orders` - Gestión de pedidos

---

## ⭐ Puntos Extra Implementados (Más Allá de Junior)

Este proyecto va más allá de los requisitos básicos de Junior Developer, implementando funcionalidades avanzadas que demuestran capacidad de desarrollo Mid/Senior:

### 🔥 **Funcionalidades Extra Desarrolladas:**

#### 1. **🚀 Carga Masiva (Batch Upload)**

- ✅ **Endpoints Backend:** `/api/users/batch` y `/api/orders/batch`
- ✅ **Validación Avanzada:** Procesa hasta 1000 registros con reportes detallados
- ✅ **UX Superior:** Preview interactivo, manejo de errores parciales
- ✅ **Feedback Completo:** Listas desplegables de éxitos/fallos con detalles

#### 2. **🎲 Generación de Datos Dummy (Faker.js)**

- ✅ **Integración @faker-js/faker** para datos realistas
- ✅ **Botones de Generación Rápida:** 5, 10, 25, 50, 100+ registros
- ✅ **Testing Instantáneo:** Sin necesidad de crear JSONs manualmente
- ✅ **Datos Contextuales:** Productos, nombres, emails realistas

#### 3. **🔍 Filtrado Inteligente de Pedidos**

- ✅ **Navegación Contextual:** Desde usuarios → pedidos específicos
- ✅ **URLs Compartibles:** Sincronización con parámetros de URL
- ✅ **Banner Informativo:** "Mostrando pedidos de: Juan Pérez"
- ✅ **Estado Persistente:** Mantiene filtro durante operaciones CRUD

#### 4. **📤 Exportación a JSON con Filtros**

- ✅ **Exportación Inteligente:** Respeta filtros activos automáticamente
- ✅ **Nombres Descriptivos:** `orders_export_2025-10-08_user_5.json`
- ✅ **Sin Paginación:** Exporta todos los resultados filtrados
- ✅ **Backup de Datos:** Formato portable para reutilización

#### 5. **🎨 UX/UI Profesional**

- ✅ **CSS Modular:** Cada componente con su propio `.css` (requisito cumplido)
- ✅ **Loading States:** Spinners, skeletons, estados de carga
- ✅ **Manejo de Errores:** Mensajes descriptivos, validación en tiempo real
- ✅ **Diseño Responsivo:** Bootstrap 5.3 con personalización avanzada

#### 6. **⚡ Optimizaciones de Performance**

- ✅ **Custom Hooks:** `useUsers()`, `useOrders()` para reutilización
- ✅ **Context API:** Estado global sin prop drilling
- ✅ **Paginación Configurable:** 10, 25, 50, 100 items por página
- ✅ **Lazy Loading:** Carga bajo demanda

#### 7. **🔧 Arquitectura Avanzada**

- ✅ **Separación de Responsabilidades:** Services, Hooks, Components
- ✅ **API Service Layer:** Cliente HTTP centralizado con manejo de errores
- ✅ **Migraciones de BD:** Flask-Migrate para cambios de esquema
- ✅ **Comandos CLI:** `flask insert-test-users` para desarrollo

### 💡 **Valor Añadido para el Negocio:**

| Funcionalidad      | Beneficio Junior          | Beneficio Extra Implementado           |
| ------------------ | ------------------------- | -------------------------------------- |
| **CRUD Básico**    | Crear/Ver/Editar/Eliminar | + Carga masiva 1000 registros/lote     |
| **Listado Simple** | Paginación básica         | + Filtrado contextual + Exportación    |
| **Validación**     | Email único, amount > 0   | + Validación tiempo real + UX feedback |
| **UI Básica**      | Bootstrap estándar        | + Componentes personalizados + Estados |
| **API REST**       | Endpoints CRUD            | + Batch endpoints + Export endpoints   |

### 🎯 **Demostración de Habilidades:**

- **🏗️ Arquitectura:** Separación clara, hooks reutilizables, servicios modulares
- **💼 Visión de Producto:** Funcionalidades que realmente usaría un usuario final
- **🎨 Atención al Detalle:** Nombres de archivo con timestamp, feedback visual, UX pulida
- **⚡ Performance:** Optimizaciones reales (paginación, lazy loading, estado eficiente)
- **🔍 Problem Solving:** Manejo de errores parciales, validaciones complejas
- **📚 Documentación:** README completo, código autodocumentado

---

## 🎯 Funcionalidades

### 🔥 1. **Carga Masiva de Datos (Batch Upload)**

**Backend:**

- Endpoint `POST /api/users/batch` - Hasta 1000 usuarios por lote
- Endpoint `POST /api/orders/batch` - Hasta 1000 pedidos por lote
- Validaciones exhaustivas con reportes detallados
- Manejo de errores parciales (crea los válidos, reporta los fallidos)

**Frontend:**

- Componente `UserBatchUpload` con preview interactivo
- Componente `OrderBatchUpload` con preview interactivo
- Descarga de plantillas JSON de ejemplo
- Visualización de errores con índice exacto y motivo
- **Listas desplegables de éxitos y fallos** con detalles completos

**Beneficios:**

- ⚡ Carga de 100+ usuarios en segundos vs. formulario uno por uno
- 📊 Reportes detallados: "8 creados, 2 fallidos (ver motivos)"
- 🎨 UX excepcional con preview, validación y feedback visual

**Funcionalidad completa implementada y documentada en el código.**

---

### 🎲 2. **Generación de Datos Dummy con Faker.js**

**Implementación:**

- Integración de `@faker-js/faker` para datos realistas
- Botones de generación rápida: 5, 10, 25, 50, 100+ registros
- Datos generados: nombres, emails, productos, cantidades

**Usuarios Dummy:**

```javascript
// Genera automáticamente
{ name: "Dr. Sarah Johnson", email: "sarah.johnson@example.com" }
{ name: "Michael Anderson", email: "michael.anderson@example.net" }
```

**Pedidos Dummy:**

```javascript
// Asigna automáticamente a usuarios existentes
{ user_id: 5, product_name: "Refined Steel Table", amount: 3 }
{ user_id: 2, product_name: "Ergonomic Plastic Chair", amount: 12 }
```

**Beneficios:**

- 🚀 Testing instantáneo sin crear JSONs manualmente
- 🎭 Datos realistas para demos y presentaciones
- 💼 Pruebas de carga con volúmenes variables

**Integración completa con @faker-js/faker para datos realistas.**

---

### 🔍 3. **Filtrado Inteligente de Pedidos**

**Funcionalidad:**

- Filtro por usuario desde la tabla de usuarios
- Banner informativo: "Mostrando pedidos de: Juan Pérez"
- Botón "Ver todos" para limpiar filtro

**Backend:**

- Parámetro `user_id` opcional en `GET /api/orders`
- Filtro aplicado a exportaciones automáticamente

**Frontend:**

- Hook `useOrders` con soporte de filtros dinámicos
- Sincronización con URL (compartir/copiar enlaces)
- Estado persistente durante operaciones CRUD

**Beneficios:**

- 🎯 Navegación contextual entre usuarios y pedidos
- 🔗 URLs amigables y compartibles
- 📱 Experiencia de usuario fluida

**Sistema de filtrado contextual implementado.**

---

### 📤 4. **Exportación Inteligente a JSON**

**Funcionalidad:**

- Botón "Exportar a JSON" en pedidos y usuarios
- **Respeta filtros activos**: exporta solo lo que ves
- Nombres de archivo descriptivos con timestamp
  - Sin filtro: `orders_export_2025-10-08.json`
  - Con filtro: `orders_export_2025-10-08_user_5.json`

**Backend:**

- Endpoint `GET /api/orders/export?user_id=X`
- Endpoint `GET /api/users/export`
- Sin paginación (exporta todos los resultados filtrados)

**Beneficios:**

- 💾 Backup de datos en formato portable
- 📊 Reportes específicos por usuario
- 🔄 Reutilización de datos (importar en otros sistemas)

**Sistema de exportación inteligente con respeto de filtros activos.**

---

### 📱 5. **Diseño UI/UX Excepcional**

**Estilos CSS Personalizados:**

- ✅ Todos los estilos en archivos `.css` separados (NO inline styles)
- ✅ Cada componente tiene su propio archivo CSS
  - `Users.jsx` → `Users.css`
  - `Orders.jsx` → `Orders.css`
  - `UserTable.jsx` → `UserTable.css`
  - `OrderTable.jsx` → `OrderTable.css`

**Componentes Destacados:**

- 🎨 Navbar responsive con navegación activa
- 📊 Tablas con hover effects y estados visuales
- 🔘 Botones con iconos y estados (loading, disabled)
- 📦 Modales interactivos con animaciones suaves
- 🎭 Loading skeletons durante carga de datos
- ✅ Badges de estado con colores semánticos

**Paleta de Colores:**

- Verde: Operaciones exitosas
- Rojo: Errores y eliminaciones
- Azul: Información y acciones primarias
- Amarillo: Advertencias y datos generados

---

### ⚡ 6. **Optimizaciones de Rendimiento**

- **Paginación en Backend y Frontend**
  - Configurable: 10, 25, 50, 100 items por página
  - Reducción de carga en DB y renderizado
- **Lazy Loading de Datos**
  - Carga bajo demanda con scroll
- **Context API para Estado Global**
  - Evita prop drilling
  - Estado compartido eficiente
- **Custom Hooks Reutilizables**
  - `useUsers()` - Gestión completa de usuarios
  - `useOrders()` - Gestión completa de pedidos
  - Reducción de código duplicado

---

### 🛠️ 7. **Manejo Avanzado de Errores**

**Backend:**

- Try-catch en todos los endpoints
- Códigos HTTP apropiados (200, 201, 400, 404, 500)
- Mensajes descriptivos de error
- Logging de errores del servidor

**Frontend:**

- Manejo graceful de errores de red
- Mensajes amigables al usuario
- Rollback de estado en operaciones fallidas
- Toasts/alerts informativos

---

### 🔐 8. **Validaciones Exhaustivas**

**Backend (Flask):**

```python
# Email único y formato válido
@validates('email')
def validate_email(self, key, email):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise ValueError("Invalid email format")
    return email

# Amount positivo
@validates('amount')
def validate_amount(self, key, amount):
    if amount <= 0:
        raise ValueError("Amount must be greater than 0")
    return amount
```

**Frontend (React):**

- Validación en tiempo real en formularios
- Deshabilita botones hasta validación exitosa
- Feedback visual inmediato (bordes rojos/verdes)

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología            | Versión | Propósito              |
| --------------------- | ------- | ---------------------- |
| **Python**            | 3.10+   | Lenguaje backend       |
| **Flask**             | 3.0.x   | Framework web          |
| **SQLAlchemy**        | 2.x     | ORM para base de datos |
| **Flask-Migrate**     | 4.x     | Migraciones de DB      |
| **Flask-CORS**        | 4.x     | Habilitar CORS         |
| **PostgreSQL/SQLite** | -       | Base de datos          |

### Frontend

| Tecnología       | Versión | Propósito                 |
| ---------------- | ------- | ------------------------- |
| **React**        | 18.2.x  | Framework UI              |
| **React Router** | 6.x     | Enrutamiento SPA          |
| **Bootstrap**    | 5.3.x   | Diseño responsivo         |
| **Faker.js**     | 8.x     | Generación de datos dummy |
| **Vite**         | 5.x     | Build tool y dev server   |

### Herramientas

- **Pipenv** - Gestión de dependencias Python
- **npm** - Gestión de paquetes Node
- **Git** - Control de versiones
- **GitHub Codespaces** - Entorno de desarrollo

---

## 📦 Instalación y Configuración

### Prerrequisitos

- **Python 3.10+**
- **Node.js 20+**
- **PostgreSQL** (o SQLite para desarrollo)
- **Pipenv**

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/4GeeksAcademy/users_and_orders.git
cd users_and_orders
```

### 2️⃣ Configurar Backend (Flask)

```bash
# Instalar dependencias de Python
pipenv install

# Crear archivo de configuración
cp .env.example .env

# Configurar DATABASE_URL en .env
# PostgreSQL: postgres://username:password@localhost:5432/dbname
# SQLite: sqlite:////test.db

# Ejecutar migraciones
pipenv run migrate
pipenv run upgrade

# Iniciar servidor backend (Puerto 5000)
pipenv run start
```

### 3️⃣ Configurar Frontend (React)

```bash
# En otra terminal
# Instalar dependencias de Node
npm install

# Iniciar servidor de desarrollo (Puerto 5173)
npm run dev
```

### 4️⃣ Acceder a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Documentación API:** Ver sección [Endpoints](#-endpoints-de-la-api)

---

## 🗄️ Poblar Base de Datos con Datos de Prueba

### Opción 1: Comando Flask (Usuarios)

```bash
# Crear 5 usuarios de prueba
flask insert-test-users 5
```

### Opción 2: Interfaz Gráfica (Recomendado)

1. Abre http://localhost:5173/users
2. Click en **"Carga Masiva"**
3. Selecciona **"Generar 50 usuarios"** (Faker.js)
4. Click en **"Cargar Usuarios"**
5. Ve a http://localhost:5173/orders
6. Click en **"Carga Masiva"**
7. Selecciona **"Generar 100 pedidos"**
8. Click en **"Cargar Pedidos"**

🎉 ¡Listo! Ya tienes 50 usuarios y 100 pedidos para probar todas las funcionalidades.

---

## 🔌 Endpoints de la API

### 👥 Usuarios (Users)

| Método   | Endpoint                        | Descripción                   | Body                              |
| -------- | ------------------------------- | ----------------------------- | --------------------------------- |
| `GET`    | `/api/users`                    | Listar usuarios (paginado)    | -                                 |
| `GET`    | `/api/users?page=1&per_page=10` | Usuarios con paginación       | -                                 |
| `GET`    | `/api/users/<id>`               | Obtener usuario por ID        | -                                 |
| `GET`    | `/api/users/<id>/orders`        | Pedidos de un usuario         | -                                 |
| `POST`   | `/api/users`                    | Crear usuario                 | `{"name": "...", "email": "..."}` |
| `POST`   | `/api/users/batch`              | **Carga masiva** (hasta 1000) | `{"users": [{...}]}`              |
| `PUT`    | `/api/users/<id>`               | Actualizar usuario            | `{"name": "...", "email": "..."}` |
| `DELETE` | `/api/users/<id>`               | Eliminar usuario              | -                                 |
| `GET`    | `/api/users/export`             | **Exportar a JSON**           | -                                 |

### 📦 Pedidos (Orders)

| Método   | Endpoint                         | Descripción                   | Body                                                 |
| -------- | -------------------------------- | ----------------------------- | ---------------------------------------------------- |
| `GET`    | `/api/orders`                    | Listar pedidos (paginado)     | -                                                    |
| `GET`    | `/api/orders?user_id=5`          | **Filtrar por usuario**       | -                                                    |
| `GET`    | `/api/orders?page=1&per_page=10` | Pedidos con paginación        | -                                                    |
| `GET`    | `/api/orders/<id>`               | Obtener pedido por ID         | -                                                    |
| `POST`   | `/api/orders`                    | Crear pedido                  | `{"user_id": 1, "product_name": "...", "amount": 5}` |
| `POST`   | `/api/orders/batch`              | **Carga masiva** (hasta 1000) | `{"orders": [{...}]}`                                |
| `PUT`    | `/api/orders/<id>`               | Actualizar pedido             | `{"product_name": "...", "amount": 10}`              |
| `DELETE` | `/api/orders/<id>`               | Eliminar pedido               | -                                                    |
| `GET`    | `/api/orders/export`             | **Exportar a JSON**           | -                                                    |
| `GET`    | `/api/orders/export?user_id=5`   | **Exportar filtrado**         | -                                                    |

### 📊 Ejemplos de Respuestas

**GET /api/users**

```json
{
  "users": [
    {
      "id": 1,
      "name": "María García",
      "email": "maria.garcia@example.com",
      "created_at": "2025-10-08T10:30:00"
    }
  ],
  "total": 50,
  "page": 1,
  "per_page": 10,
  "pages": 5
}
```

**POST /api/users/batch** (Carga Masiva)

```json
{
  "success": true,
  "created": 48,
  "failed": 2,
  "total_processed": 50,
  "users": [...],
  "errors": [
    {
      "index": 3,
      "data": {"name": "...", "email": "..."},
      "error": "Email already exists"
    }
  ]
}
```

**GET /api/orders?user_id=5**

```json
{
  "orders": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "Juan Pérez",
      "product_name": "Laptop Dell XPS",
      "amount": 2,
      "created_at": "2025-10-08T11:00:00"
    }
  ],
  "total": 3,
  "page": 1,
  "per_page": 10
}
```

---

## 📁 Estructura del Proyecto

```
users_and_orders/
├── src/
│   ├── api/                      # Backend Flask
│   │   ├── models.py            # Modelos SQLAlchemy (User, Order)
│   │   ├── routes.py            # Endpoints de la API
│   │   ├── utils.py             # Utilidades y validaciones
│   │   ├── commands.py          # Comandos CLI personalizados
│   │   └── admin.py             # Panel de administración
│   │
│   ├── front/                   # Frontend React
│   │   ├── main.jsx             # Punto de entrada
│   │   ├── routes.jsx           # Configuración de rutas
│   │   ├── store.js             # Estado global (Context API)
│   │   │
│   │   ├── pages/               # Páginas principales
│   │   │   ├── Users.jsx        # Gestión de usuarios
│   │   │   ├── Users.css        # Estilos de usuarios
│   │   │   ├── Orders.jsx       # Gestión de pedidos
│   │   │   ├── Orders.css       # Estilos de pedidos
│   │   │   ├── Layout.jsx       # Layout principal
│   │   │   └── Home.jsx         # Página de inicio
│   │   │
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Navbar.jsx       # Barra de navegación
│   │   │   ├── UserTable.jsx    # Tabla de usuarios
│   │   │   ├── UserTable.css    # Estilos de tabla usuarios
│   │   │   ├── OrderTable.jsx   # Tabla de pedidos
│   │   │   ├── OrderTable.css   # Estilos de tabla pedidos
│   │   │   ├── UserForm.jsx     # Formulario de usuario
│   │   │   ├── OrderForm.jsx    # Formulario de pedido
│   │   │   ├── UserBatchUpload.jsx   # Carga masiva usuarios
│   │   │   ├── OrderBatchUpload.jsx  # Carga masiva pedidos
│   │   │   ├── Pagination.jsx   # Paginación reutilizable
│   │   │   └── EditUserModal.jsx     # Modal de edición
│   │   │
│   │   ├── hooks/               # Custom Hooks
│   │   │   ├── useUsers.js      # Hook para usuarios
│   │   │   └── useOrders.js     # Hook para pedidos
│   │   │
│   │   ├── services/            # Servicios de API
│   │   │   └── apiService.js    # Cliente HTTP (fetch wrapper)
│   │   │
│   │   └── contexts/            # Context Providers
│   │       └── SearchContext.jsx # Contexto de búsqueda
│   │
│   └── app.py                   # Aplicación Flask principal
│
├── migrations/                  # Migraciones de base de datos
│   └── versions/                # Versiones de migraciones
│
├── docs/                        # Documentación adicional
│   └── assets/                  # Recursos gráficos
│
├── package.json                # Dependencias Node.js
├── Pipfile                     # Dependencias Python
├── vite.config.js              # Configuración Vite
├── requirements.txt            # Requirements alternativo
├── render.yaml                 # Configuración de deploy
└── README.md                   # Este archivo
```

---

## 🖼️ Capturas de Pantalla

### 🏠 Pantalla de Usuarios

![Usuarios](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Users+Management+Screen)

**Funcionalidades visibles:**

- Formulario de creación con validación en tiempo real
- Tabla responsive con paginación
- Botones de acción: Editar, Eliminar, Ver Pedidos
- **Carga Masiva** con preview y validación
- **Generación de datos Faker** con un click
- Indicadores de carga (loading spinners)

---

### 📦 Pantalla de Pedidos

![Pedidos](https://via.placeholder.com/800x400/50C878/FFFFFF?text=Orders+Management+Screen)

**Funcionalidades visibles:**

- Selector de usuario para nuevos pedidos
- Tabla con información del usuario asociado
- **Filtro activo** con banner informativo
- Botón **"Exportar a JSON"** (respeta filtros)
- **Carga masiva** de pedidos
- Paginación con control de items por página

---

### 📤 Carga Masiva con Preview

![Batch Upload](https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Batch+Upload+with+Preview)

**Funcionalidades visibles:**

- Preview de primeros 10 registros
- Indicador de total: "... y 40 más"
- Botones de generación Faker: 10, 25, 50, 100
- Descarga de plantilla JSON
- Selector de archivo con validación
- Botones de confirmar/cancelar

---

### ✅ Reporte Detallado de Resultados

![Batch Results](https://via.placeholder.com/800x400/9B59B6/FFFFFF?text=Detailed+Batch+Results)

**Funcionalidades visibles:**

- Tarjetas de resumen: Total, Exitosos, Fallidos
- **Lista desplegable de usuarios creados** (verde)
  - ID asignado, nombre, email, timestamp
- **Lista desplegable de usuarios fallidos** (rojo)
  - Índice en archivo, datos, motivo del error
- Colores semánticos para fácil identificación

---

## 🚀 Deploy

### Opción 1: Render.com (Recomendado)

Este proyecto está configurado para deploy automático en Render.

**Archivos de configuración:**

- `render.yaml` - Configuración de servicios
- `render_build.sh` - Script de build
- `Dockerfile.render` - Imagen Docker

**Pasos:**

1. Crea cuenta en [Render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Render detectará automáticamente `render.yaml`
4. Click en "Apply" para crear servicios
5. ✅ ¡Deploy automático!

**URLs generadas:**

- Frontend: `https://your-app.onrender.com`
- Backend: `https://your-app-api.onrender.com`

📚 **Guía completa:** [4Geeks Deploy Guide](https://4geeks.com/es/docs/start/despliega-con-render-com)

---

### Opción 2: Vercel (Frontend) + Render (Backend)

**Frontend en Vercel:**

```bash
npm install -g vercel
vercel --prod
```

**Backend en Render:**

- Sigue los pasos de Opción 1 solo para el backend

---

### Opción 3: Docker Compose (Local/Producción)

```bash
# Build y ejecutar
docker-compose up --build

# Acceder
# Frontend: http://localhost:80
# Backend: http://localhost:5000
```

---

## 📝 Variables de Entorno

### Backend (`.env`)

```bash
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# O para desarrollo local:
# DATABASE_URL=sqlite:////test.db

# Flask
FLASK_APP=src/app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# CORS (opcional)
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env` o `.env.local`)

```bash
# URL del backend API
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🎓 Aprendizajes y Decisiones Técnicas

### 1. **¿Por qué SQLAlchemy en lugar de SQL puro?**

- ✅ Abstracción de base de datos (SQLite/Postgres sin cambios)
- ✅ Migraciones automáticas con Flask-Migrate
- ✅ Validaciones en el modelo (DRY principle)
- ✅ Relaciones definidas claramente
- ✅ Protección contra SQL injection

### 2. **¿Por qué Custom Hooks (useUsers, useOrders)?**

- ✅ Reutilización de lógica en múltiples componentes
- ✅ Separación de concerns (UI vs lógica de datos)
- ✅ Facilita testing unitario
- ✅ Código más limpio y mantenible

### 3. **¿Por qué Archivos CSS Separados?**

- ✅ Cumplimiento de requisitos del proyecto
- ✅ Mejor organización y mantenibilidad
- ✅ Facilita trabajo en equipo (evita conflictos)
- ✅ Permite reutilización de estilos
- ✅ Debugging más sencillo

### 4. **¿Por qué Implementar Carga Masiva?**

- ✅ Ahorro de tiempo en testing y demos
- ✅ Funcionalidad real en aplicaciones empresariales
- ✅ Demuestra conocimiento de UX/performance
- ✅ Diferenciador en la prueba técnica

### 5. **¿Por qué Faker.js?**

- ✅ Datos realistas para testing
- ✅ Sin necesidad de archivos JSON manuales
- ✅ Testing con diferentes volúmenes (10, 100, 1000+)
- ✅ Reproducibilidad en demos

---

## 🏆 Comparación: Junior vs. Implementado

### 📊 **Requisitos Junior vs. Desarrollo Actual**

| Aspecto            | Requerido (Junior)      | ✅ Implementado (Mid/Senior)          |
| ------------------ | ----------------------- | ------------------------------------- |
| **CRUD Backend**   | Endpoints básicos       | + Batch endpoints + Export            |
| **Frontend**       | Formularios simples     | + Carga masiva + Preview + Faker      |
| **Validación**     | Email único, amount > 0 | + Tiempo real + UX feedback           |
| **UI/UX**          | Bootstrap básico        | + CSS modular + Estados + Animaciones |
| **Base de Datos**  | SQLite/Postgres         | + Migraciones + Comandos CLI          |
| **Listados**       | Paginación opcional     | + Filtrado + URLs compartibles        |
| **Manejo Errores** | Básico                  | + Mensajes descriptivos + Rollback    |
| **Arquitectura**   | MVC simple              | + Hooks + Context + Services          |

### ✨ **Lo que hace especial a este proyecto:**

1. **📋 100% Requisitos Junior + Extras**

   - Todos los puntos obligatorios implementados y superados
   - 7 funcionalidades extra que añaden valor real

2. **🎯 Funcionalidades de Valor Empresarial**

   - **Carga masiva:** Ahorra horas de trabajo manual
   - **Exportación inteligente:** Backups y reportes automatizados
   - **Filtrado contextual:** Navegación intuitiva usuario → pedidos
   - **Datos dummy:** Testing y demos instantáneos

3. **🎨 UX de Nivel Profesional**

   - Loading states que mejoran percepción de performance
   - Feedback visual inmediato en todas las acciones
   - Mensajes de error que realmente ayudan al usuario
   - Diseño responsive que funciona en móviles

4. **🔧 Código de Nivel Senior**

   - **Custom Hooks reutilizables:** Evitan duplicación de lógica
   - **Separación de responsabilidades:** Services, Hooks, Components
   - **Manejo de estado profesional:** Context API sin prop drilling
   - **Validaciones exhaustivas:** Backend + Frontend sincronizadas

5. **📚 Documentación Profesional**

   - README con ejemplos prácticos y capturas
   - Código autodocumentado con nomenclatura clara
   - Guías de instalación que realmente funcionan
   - Estructura de proyecto explicada

6. **🚀 Production-Ready**
   - Deploy automático configurado (Render.com)
   - Variables de entorno manejadas correctamente
   - Optimizaciones de performance implementadas
   - Manejo robusto de errores en producción

---

## 🤝 Contribuciones

Este proyecto fue desarrollado como prueba técnica Fullstack, demostrando:

- ✅ **Conocimiento Técnico:** React, Flask, SQLAlchemy, Bootstrap
- ✅ **Buenas Prácticas:** Clean Code, DRY, SOLID principles
- ✅ **Visión de Producto:** Funcionalidades más allá de requisitos
- ✅ **Atención al Detalle:** UX, validaciones, documentación
- ✅ **Capacidad de Aprendizaje:** Implementación de tecnologías nuevas

---

## 📞 Contacto

**Desarrollador:** edslogia
**GitHub:** [github.com/edslogia](https://github.com/edslogia)
**Repositorio:** [4GeeksAcademy/users_and_orders](https://github.com/4GeeksAcademy/users_and_orders)

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos y de demostración.

---

## 🙏 Agradecimientos

Plantilla base proporcionada por [4Geeks Academy](https://4geeksacademy.com/).

**Tecnologías y librerías utilizadas:**

- React Team por React
- Pallets por Flask
- SQLAlchemy Team
- Faker.js Contributors
- Bootstrap Team

---

<div align="center">

**⭐ Si este proyecto te resultó útil, considera darle una estrella en GitHub ⭐**

**Desarrollado con ❤️ y mucho ☕**

</div>
