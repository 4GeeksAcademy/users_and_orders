# ✨ Nueva Funcionalidad: Filtro de Pedidos por Usuario

## 📋 Descripción

Se ha implementado la funcionalidad para filtrar pedidos por usuario desde la tabla de usuarios. Al hacer clic en el botón "Pedidos" de un usuario específico, se navega a la página de Orders con un filtro activo que muestra únicamente los pedidos de ese usuario.

## 🔧 Cambios Implementados

### 1. Backend (`src/api/routes.py`)

**Endpoint actualizado:** `GET /api/orders`

- ✅ Agregado parámetro opcional `user_id` para filtrar pedidos
- ✅ Los pedidos se ordenan por `created_at` descendente
- ✅ Mantiene paginación y compatibilidad con versión anterior

**Endpoint actualizado:** `GET /api/orders/export`

- ✅ Agregado parámetro opcional `user_id` para exportar solo pedidos filtrados
- ✅ La exportación respeta los filtros activos
- ✅ El nombre del archivo exportado indica si hay filtros aplicados

**Ejemplo de uso:**

```bash
# Obtener pedidos con paginación
GET /api/orders?user_id=5&page=1&per_page=10

# Exportar pedidos de un usuario específico
GET /api/orders/export?user_id=5
```

### 2. Hook de React (`src/front/hooks/useOrders.js`)

**Nuevas funcionalidades:**

- ✅ Acepta `initialFilters` como parámetro (ej: `{ user_id: 5 }`)
- ✅ Nueva función `applyFilters(newFilters)` - Aplica nuevos filtros y resetea a página 1
- ✅ Nueva función `clearFilters()` - Limpia todos los filtros
- ✅ Estado `filters` disponible en el return
- ✅ Todas las funciones (create, update, fetch) respetan los filtros activos
- ✅ **Exportación inteligente**: `exportOrders()` respeta los filtros activos y genera nombres de archivo descriptivos

**Ejemplo de uso:**

```javascript
const { orders, filters, applyFilters, clearFilters } = useOrders({
  user_id: 5,
});
```

### 3. Página Orders (`src/front/pages/Orders.jsx`)

**Nuevas funcionalidades:**

- ✅ Lee parámetros `user_id` y `user_name` de la URL usando `useSearchParams`
- ✅ Inicializa el hook `useOrders` con filtros basados en la URL
- ✅ Banner informativo cuando hay un filtro activo
- ✅ Botón "Ver todos los pedidos" para limpiar el filtro
- ✅ Se sincroniza automáticamente con cambios en la URL

**Banner de filtro activo:**

```
ℹ️ Mostrando pedidos de: Juan Pérez    [✖ Ver todos los pedidos]
```

### 4. Componente UserTable (`src/front/components/UserTable.jsx`)

**Cambios:**

- ✅ Importa y usa `useNavigate` de react-router-dom
- ✅ Nueva función `handleViewOrders(userId, userName)` que navega a `/orders` con parámetros
- ✅ El botón "Pedidos" ahora usa la navegación en lugar de la prop `onViewOrders` (deprecated)

**Navegación:**

```javascript
navigate(`/orders?user_id=${userId}&user_name=${encodeURIComponent(userName)}`);
```

## 🚀 Cómo Usar

### Desde la interfaz de usuario:

1. Ve a la página de **Usuarios** (`/users`)
2. Encuentra un usuario en la tabla
3. Haz clic en el botón **"Pedidos"**
4. Serás redirigido a `/orders?user_id=X&user_name=NombreUsuario`
5. Verás un banner indicando que estás filtrando por ese usuario
6. Haz clic en **"Ver todos los pedidos"** para limpiar el filtro

### Desde la URL directamente:

Puedes compartir o copiar URLs con filtros:

```
http://localhost:3000/orders?user_id=5&user_name=Juan%20Pérez
```

### Desde código (API):

```bash
# Obtener pedidos de usuario específico
curl http://localhost:3000/api/orders?user_id=5

# Obtener pedidos de usuario con paginación
curl http://localhost:3000/api/orders?user_id=5&page=2&per_page=20

# Exportar pedidos de usuario específico
curl http://localhost:3000/api/orders/export?user_id=5
```

### Exportar con filtros:

Cuando hay un filtro activo y haces clic en **"Exportar a JSON"**:

- Solo se exportan los pedidos del filtro activo
- El archivo tiene un nombre descriptivo: `orders_export_2025-10-08_user_5.json`
- Sin filtros: `orders_export_2025-10-08.json`

## ✅ Ventajas de esta Implementación

1. **Reutilización de componentes:** No se creó una página nueva, se reutilizó Orders
2. **URLs compartibles:** Puedes copiar/pegar la URL con el filtro activo
3. **Historial del navegador:** El botón "atrás" funciona correctamente
4. **UX clara:** Banner visible indica que hay un filtro activo
5. **Fácil de limpiar:** Un clic para ver todos los pedidos nuevamente
6. **Escalable:** Fácil agregar más filtros en el futuro (por producto, por fecha, etc.)
7. **Exportación inteligente:** La exportación respeta los filtros activos automáticamente

## 🧪 Testing

Para probar la funcionalidad:

1. Crea varios usuarios
2. Crea pedidos para diferentes usuarios
3. Haz clic en "Pedidos" de un usuario → Deberías ver solo sus pedidos
4. Haz clic en "Ver todos los pedidos" → Deberías ver todos los pedidos
5. Modifica la URL manualmente agregando `?user_id=X` → Debería filtrar correctamente
6. Elimina el parámetro de la URL → Debería mostrar todos los pedidos
7. **Con filtro activo**, haz clic en "Exportar a JSON" → Solo se exportan los pedidos filtrados
8. **Sin filtro activo**, haz clic en "Exportar a JSON" → Se exportan todos los pedidos

## 📝 Notas Técnicas

- La prop `onViewOrders` en UserTable está marcada como DEPRECATED pero se mantiene por compatibilidad
- Los filtros se mantienen durante operaciones CRUD (crear, actualizar pedidos)
- La paginación se resetea a página 1 cuando se aplica un nuevo filtro
- **La exportación siempre respeta los filtros activos** (tanto en frontend como backend)
- El nombre del archivo exportado incluye el `user_id` si hay un filtro activo
- Si un usuario no tiene pedidos, se mostrará la lista vacía con el filtro activo
- Si un usuario no tiene pedidos, se mostrará la lista vacía con el filtro activo

## 🔮 Futuras Mejoras Posibles

- [ ] Filtro por rango de fechas
- [ ] Filtro por nombre de producto
- [ ] Filtro por monto mínimo/máximo
- [ ] Búsqueda de texto en pedidos
- [ ] Combinación de múltiples filtros
- [ ] Guardar filtros favoritos en localStorage
