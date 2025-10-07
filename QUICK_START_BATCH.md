# 🚀 Quick Start - Carga Masiva de Usuarios

## ¿Qué se implementó?

✅ **Backend**

- Nuevo endpoint `POST /api/users/batch`
- Validaciones completas (emails, duplicados, formato)
- Manejo de hasta 1000 usuarios por carga
- Reporte detallado de éxitos y errores

✅ **Frontend**

- Componente `UserBatchUpload` completamente funcional
- Preview de datos antes de cargar
- Botón para descargar plantilla JSON
- Mensajes de éxito y error detallados
- Interfaz desplegable/colapsable

✅ **Archivos Creados/Modificados**

**Backend:**

- `src/api/routes.py` → Agregado endpoint `/users/batch`

**Frontend:**

- `src/front/components/UserBatchUpload.jsx` → Nuevo componente
- `src/front/services/apiService.js` → Agregado método `users.batchCreate()`
- `src/front/pages/Users.jsx` → Integrado componente de carga masiva

**Documentación:**

- `ejemplo_usuarios.json` → Archivo de ejemplo con 10 usuarios
- `BATCH_UPLOAD_GUIDE.md` → Guía completa de uso

## 📋 Formato del JSON

```json
{
  "users": [
    {
      "name": "Nombre Completo",
      "email": "email@ejemplo.com"
    }
  ]
}
```

## 🎯 Cómo Probar

1. **Iniciar el servidor**

   ```bash
   # En una terminal
   cd /workspaces/users_and_orders
   pipenv run start

   # En otra terminal
   npm run dev
   ```

2. **Ir a la página de Usuarios**

   - Abre http://localhost:5173/users
   - Expande la sección "Carga Masiva"

3. **Opción A: Descargar plantilla**

   - Click en el botón de descarga (📥)
   - Edita el archivo descargado
   - Sube el archivo

4. **Opción B: Usar archivo de ejemplo**
   - Usa el archivo `ejemplo_usuarios.json` incluido en el proyecto
   - Click en "Seleccionar archivo" y elige `ejemplo_usuarios.json`
   - Verás el preview de 10 usuarios
   - Click en "Cargar 10 Usuario(s)"

## ✨ Características Destacadas

### 1. Preview Inteligente

- Muestra los primeros 10 usuarios
- Indica cuántos más hay (ej: "... y 5 más")
- Permite verificar antes de confirmar

### 2. Validaciones Robustas

- ✅ Formato de email
- ✅ Emails duplicados en BD
- ✅ Emails duplicados en el mismo archivo
- ✅ Campos requeridos
- ✅ Límite de 1000 usuarios

### 3. Reporte Detallado

```
Resultado de la Carga
• Total procesados: 10
• Creados exitosamente: 8
• Fallidos: 2

Ver errores (2)
  Índice 3: Email john@example.com already exists
  Índice 7: Invalid email format
```

### 4. Manejo de Errores Parciales

- Si 8 de 10 usuarios son válidos, crea los 8
- Muestra exactamente qué usuarios fallaron y por qué
- No es todo o nada, aprovecha lo que se puede

## 🎨 UI/UX

### Sección Colapsable

```
┌─────────────────────────────────┐
│ 📥 Carga Masiva            [▼] │
├─────────────────────────────────┤
│ [📁 Seleccionar archivo] [📥]  │
│                                  │
│ Preview: 10 usuario(s)          │
│ ┌──────────────────────────┐   │
│ │ # │ Nombre   │ Email     │   │
│ │ 1 │ María    │ maria@... │   │
│ │ 2 │ Juan     │ juan@...  │   │
│ └──────────────────────────┘   │
│                                  │
│      [Cancelar] [Cargar 10]     │
└─────────────────────────────────┘
```

## 🔧 Personalización

### Cambiar límite de usuarios por lote

```python
# Backend: src/api/routes.py
if len(body["users"]) > 1000:  # Cambiar 1000 por tu límite
    return jsonify({"error": "Maximum 1000 users per batch"}), 400
```

### Modificar campos requeridos

```javascript
// Frontend: src/front/components/UserBatchUpload.jsx
// Agregar más validaciones en la función validateUsers()
```

## 📊 Ejemplo de Respuesta

**Carga exitosa completa:**

```json
{
  "success": true,
  "created": 10,
  "failed": 0,
  "total_processed": 10,
  "users": [
    { "id": 1, "name": "María García", "email": "maria.garcia@ejemplo.com", ... },
    ...
  ]
}
```

**Carga parcial con errores:**

```json
{
  "success": true,
  "created": 8,
  "failed": 2,
  "total_processed": 10,
  "users": [ ... ],
  "errors": [
    {
      "index": 3,
      "data": { "name": "...", "email": "..." },
      "error": "Email already exists"
    },
    {
      "index": 7,
      "data": { "name": "...", "email": "..." },
      "error": "Invalid email format"
    }
  ]
}
```

## 🐛 Troubleshooting

### Error: "VITE_BACKEND_URL is not defined"

Asegúrate de tener el archivo `.env` con:

```
VITE_BACKEND_URL=http://localhost:5000
```

### Error: "Cannot read properties of undefined"

Verifica que el JSON tenga la estructura correcta:

- Debe tener propiedad `users` con array
- O ser directamente un array

### Error: "Maximum 1000 users per batch"

Divide tu archivo en múltiples archivos más pequeños

## 💡 Tips

1. **Prueba primero con pocos usuarios** (2-3) para verificar
2. **Revisa el preview** antes de confirmar la carga
3. **Guarda el reporte de errores** para corregir después
4. **Usa la plantilla descargable** como base

## 🎓 Próximos Pasos Sugeridos

- [ ] Implementar lo mismo para pedidos (Orders)
- [ ] Agregar búsqueda/filtrado de usuarios
- [ ] Implementar edición/eliminación de usuarios
- [ ] Agregar exportación de usuarios a JSON
- [ ] Implementar autenticación

---

**¡Listo para usar! 🎉**

Para más detalles, consulta `BATCH_UPLOAD_GUIDE.md`
