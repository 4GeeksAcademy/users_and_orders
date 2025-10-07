## Prueba Técnica – Fullstack (React + Flask + DB con ORM + CSS)

### 🎯 Objetivo

Desarrollar una aplicación de gestión de usuarios y pedidos (Users & Orders) usando:

- **Frontend:** React
- **Backend:** Flask
- **Base de datos:** SQLite o Postgres con ORM (SQLAlchemy)

#### Se evaluará:

- [ ] CRUD completo
- [ ] Conexión coherente entre frontend y backend
- [ ] Uso de base de datos relacional con ORM
- [ ] Diseño UI mínimo con librería CSS
- [ ] Buenas prácticas de organización de código

---

### 📌 Requisitos

#### Backend (Flask + SQLAlchemy)

**Modelos:**

- [ ] User: id, name, email (único, formato válido), created_at
- [ ] Order: id, user_id (relación con User), product_name, amount, created_at

**Endpoints obligatorios:**

- [ ] `POST /users`: crear usuario
- [ ] `GET /users`: listar usuarios (paginación opcional)
- [ ] `POST /orders`: crear pedido asociado a usuario
- [ ] `GET /orders`: listar pedidos (join para mostrar nombre de usuario)
- [ ] `GET /users/<id>/orders`: listar pedidos de un usuario específico

**Validaciones:**

- [ ] No permitir emails duplicados
- [ ] Email con formato válido
- [ ] amount > 0

**Base de datos:**

- [ ] Usar SQLite o Postgres
- [ ] ORM: SQLAlchemy (Flask-Migrate opcional)

#### Frontend (React + CSS Library)

- [ ] Usar React con librería CSS (Bootstrap, TailwindCSS, Material UI, etc.)

**Pantalla Usuarios:**

- [ ] Formulario para crear usuario (nombre + email)
- [ ] Listado de usuarios (paginación opcional)
- [ ] Botón para ver pedidos de cada usuario

**Pantalla Pedidos:**

- [ ] Formulario para crear pedido seleccionando usuario existente
- [ ] Lista de pedidos mostrando: producto, cantidad, fecha y usuario

**Extras recomendados (Mid):**

- [ ] Manejo de loading y errores en llamadas a la API
- [ ] Uso de Context API o Redux para estado global
- [ ] Rutas con React Router (`/users`, `/orders`)

---

### ⭐ Puntos Extra (Opcionales)

- [ ] Búsqueda de usuarios/pedidos (por nombre, email o producto)
- [ ] Data dummy con faker/mockaroo
- [ ] Perfil de usuario: detalles y pedidos al hacer click en avatar/nombre
- [ ] Exportar a JSON: botón para exportar pedidos/publicaciones
- [ ] Carga masiva desde JSON: crear múltiples pedidos en batch
- [ ] Deploy: Vercel (frontend), Render/Heroku (backend)
- [ ] Testing básico: test en backend (pytest) o frontend (componente)

---

### 📤 Entrega

- [ ] Proyecto en repositorio público de GitHub
- [ ] Archivo `README.md` con:
  - [ ] Instrucciones de instalación y ejecución
  - [ ] Dependencias necesarias
  - [ ] Notas sobre puntos extra realizados
  - [ ] (Opcional) Enlaces de deploy de frontend y backend

---

### 📊 Evaluación

#### Junior

- [ ] CRUD básico en backend
- [ ] Conexión frontend con API
- [ ] Uso de ORM y librería CSS mínima

#### Mid

- [ ] Todo lo anterior + buenas prácticas de organización
- [ ] Validaciones en backend
- [ ] Manejo de estado y errores en frontend
- [ ] Paginación, Context API/Redux (opcional)
- [ ] Implementar uno o más puntos extra
