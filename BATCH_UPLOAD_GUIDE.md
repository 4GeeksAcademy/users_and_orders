# 📤 Carga Masiva de Usuarios

## Descripción

La funcionalidad de carga masiva permite crear múltiples usuarios a la vez mediante la importación de un archivo JSON.

## 🎯 Características

- ✅ Carga hasta 1000 usuarios por archivo
- ✅ Preview de los datos antes de cargar
- ✅ Validación de formato de email
- ✅ Detección de emails duplicados
- ✅ Descarga de plantilla de ejemplo
- ✅ Reporte detallado de éxitos y errores
- ✅ Interfaz desplegable/colapsable

## 📋 Formato del Archivo JSON

El archivo debe tener la siguiente estructura:

```json
{
  "users": [
    {
      "name": "Nombre del Usuario",
      "email": "usuario@ejemplo.com"
    },
    {
      "name": "Otro Usuario",
      "email": "otro@ejemplo.com"
    }
  ]
}
```

**También se acepta un array directo:**

```json
[
  {
    "name": "Usuario 1",
    "email": "usuario1@ejemplo.com"
  },
  {
    "name": "Usuario 2",
    "email": "usuario2@ejemplo.com"
  }
]
```

## ✅ Validaciones

El sistema valida automáticamente:

1. **Formato del archivo**: Debe ser un archivo `.json` válido
2. **Estructura**: Debe contener un array de usuarios
3. **Campos requeridos**: Cada usuario debe tener `name` y `email`
4. **Formato de email**: Validación de formato válido de email
5. **Emails únicos**: No se permiten emails duplicados en la base de datos
6. **Límite de usuarios**: Máximo 1000 usuarios por carga

## 🚀 Cómo Usar

### Opción 1: Descargar Plantilla

1. En la página de Usuarios, expande la sección "Carga Masiva"
2. Click en el botón de descarga (📥) junto al selector de archivo
3. Se descargará un archivo `plantilla_usuarios.json` con ejemplos
4. Edita el archivo con tus datos
5. Sube el archivo modificado

### Opción 2: Usar Archivo Existente

1. Usa el archivo de ejemplo incluido: `ejemplo_usuarios.json`
2. O crea tu propio archivo siguiendo el formato especificado

### Opción 3: Crear Archivo Nuevo

1. Crea un archivo `.json` con la estructura indicada
2. Asegúrate de que todos los emails sean únicos y válidos
3. Sube el archivo

## 📊 Reporte de Resultados

Después de la carga, verás un reporte con:

- **Total procesados**: Cantidad de usuarios en el archivo
- **Creados exitosamente**: Usuarios agregados a la base de datos
- **Fallidos**: Usuarios que no pudieron ser creados

Si hay errores, puedes expandir "Ver errores" para ver el detalle de cada fallo:

- Índice del usuario en el archivo
- Motivo del error (email duplicado, formato inválido, etc.)
- Datos del usuario que falló

## 🔍 Preview de Datos

Antes de cargar, el sistema muestra:

- Cantidad total de usuarios a crear
- Tabla con los primeros 10 usuarios
- Indicador si hay más usuarios (ej: "... y 5 más")

Esto te permite verificar que los datos son correctos antes de confirmar la carga.

## ⚠️ Manejo de Errores

Los errores más comunes y sus soluciones:

| Error                          | Causa                         | Solución                        |
| ------------------------------ | ----------------------------- | ------------------------------- |
| "Invalid email format"         | Email no tiene formato válido | Corregir formato del email      |
| "Email already exists"         | Email ya registrado en BD     | Usar otro email                 |
| "Duplicate email in batch"     | Email duplicado en el archivo | Eliminar duplicados del archivo |
| "name is required"             | Falta campo name              | Agregar nombre al usuario       |
| "email is required"            | Falta campo email             | Agregar email al usuario        |
| "Maximum 1000 users per batch" | Archivo muy grande            | Dividir en múltiples archivos   |

## 💡 Consejos

1. **Verifica los datos** antes de cargar usando el preview
2. **Usa emails válidos** para evitar errores
3. **Evita duplicados** revisando tu archivo antes de subirlo
4. **Divide archivos grandes** si tienes más de 1000 usuarios
5. **Guarda el reporte** si necesitas corregir errores después

## 🧪 Prueba con el Archivo de Ejemplo

```bash
# El repositorio incluye un archivo de ejemplo con 10 usuarios
ejemplo_usuarios.json
```

Este archivo contiene 10 usuarios de prueba listos para importar.

## 🛠️ Integración Técnica

### Backend Endpoint

```
POST /api/users/batch
```

**Request Body:**

```json
{
  "users": [{ "name": "...", "email": "..." }]
}
```

**Response:**

```json
{
  "success": true,
  "created": 10,
  "failed": 0,
  "total_processed": 10,
  "users": [...],
  "errors": [...]  // Solo si hay errores
}
```

### Frontend Component

```jsx
import { UserBatchUpload } from "../components/UserBatchUpload";

<UserBatchUpload onUploadSuccess={handleBatchUpload} disabled={false} />;
```

## 📝 Ejemplo de Uso en API

```javascript
// Usando apiService
import apiService from "../services/apiService";

const batchData = {
  users: [
    { name: "Usuario 1", email: "user1@example.com" },
    { name: "Usuario 2", email: "user2@example.com" },
  ],
};

const response = await apiService.users.batchCreate(batchData);
console.log(`Creados: ${response.created}/${response.total_processed}`);
```

## 🎨 Personalización

El componente `UserBatchUpload` acepta las siguientes props:

- `onUploadSuccess`: Función callback cuando la carga es exitosa
- `disabled`: Deshabilitar el componente durante operaciones

## 📚 Recursos Adicionales

- Ver código del componente: `src/front/components/UserBatchUpload.jsx`
- Endpoint backend: `src/api/routes.py` → `/users/batch`
- Servicio API: `src/front/services/apiService.js`
