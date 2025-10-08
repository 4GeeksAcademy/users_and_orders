# 🔄 Actualización: Exportación Inteligente con Filtros

## 📋 Problema Detectado

Cuando había un filtro activo (ej: viendo solo los pedidos de un usuario específico), al hacer clic en "Exportar a JSON", se exportaban **TODOS los pedidos** en lugar de solo los que estaban siendo mostrados en la tabla.

## ✅ Solución Implementada

Ahora la exportación **respeta los filtros activos** automáticamente:

- ✅ Si estás viendo pedidos de un usuario específico → Se exportan solo esos pedidos
- ✅ Si estás viendo todos los pedidos → Se exportan todos
- ✅ El nombre del archivo indica si hay filtros aplicados

## 🔧 Cambios Realizados

### 1. Frontend - API Service (`src/front/services/apiService.js`)

**Antes:**

```javascript
export: () => request("/api/orders/export"),
```

**Después:**

```javascript
export: (params = {}) => request(`/api/orders/export?${buildQueryString(params)}`),
```

Ahora acepta parámetros de filtro que se pasan como query string.

---

### 2. Frontend - Hook useOrders (`src/front/hooks/useOrders.js`)

**Cambio principal:**

```javascript
const exportOrders = async () => {
  // ...

  // Pasar los filtros activos al exportar
  const response = await apiService.orders.export(filters);

  // Nombre del archivo dinámico según filtros
  let fileName = `orders_export_${new Date().toISOString().split("T")[0]}`;
  if (filters.user_id) {
    fileName += `_user_${filters.user_id}`;
  }
  fileName += ".json";

  // ...
};
```

**Mejoras:**

- ✅ Pasa automáticamente los `filters` activos al servicio de exportación
- ✅ Genera un nombre de archivo descriptivo que incluye el `user_id` si hay filtro activo

---

### 3. Backend - Endpoint Export (`src/api/routes.py`)

**Antes:**

```python
@api.route('/orders/export', methods=['GET'])
def export_orders():
    """Export all orders to JSON"""
    try:
        # Get all orders without pagination
        orders = Order.query.join(User).all()
        # ...
```

**Después:**

```python
@api.route('/orders/export', methods=['GET'])
def export_orders():
    """Export orders to JSON (with optional filters)"""
    try:
        # Optional filter by user_id
        user_id = request.args.get('user_id', type=int)

        # Build query with join
        query = Order.query.join(User)

        # Apply user_id filter if provided
        if user_id:
            query = query.filter(Order.user_id == user_id)

        # Get all orders (no pagination for export)
        orders = query.order_by(Order.created_at.desc()).all()
        # ...
```

**Mejoras:**

- ✅ Acepta `user_id` como parámetro opcional
- ✅ Aplica el filtro si está presente
- ✅ Incluye información de filtros en la respuesta

---

## 🎯 Ejemplos de Uso

### Escenario 1: Ver pedidos de un usuario específico

1. Usuario hace clic en "Pedidos" del usuario #5 "Juan Pérez"
2. URL: `/orders?user_id=5&user_name=Juan%20Pérez`
3. Se muestran solo los pedidos de Juan Pérez
4. Usuario hace clic en "Exportar a JSON"
5. **Se exportan solo los 3 pedidos de Juan Pérez**
6. Archivo generado: `orders_export_2025-10-08_user_5.json`

### Escenario 2: Ver todos los pedidos

1. Usuario va a `/orders` (sin filtros)
2. Se muestran todos los pedidos (20 pedidos de todos los usuarios)
3. Usuario hace clic en "Exportar a JSON"
4. **Se exportan los 20 pedidos**
5. Archivo generado: `orders_export_2025-10-08.json`

---

## 🔍 Verificación

### API Endpoints

```bash
# Exportar todos los pedidos
curl http://localhost:3000/api/orders/export

# Exportar solo pedidos del usuario #5
curl http://localhost:3000/api/orders/export?user_id=5
```

### Respuesta del Backend

```json
{
  "success": true,
  "total": 3,
  "orders": [
    { "id": 1, "user_id": 5, "product_name": "Laptop", ... },
    { "id": 2, "user_id": 5, "product_name": "Mouse", ... },
    { "id": 3, "user_id": 5, "product_name": "Teclado", ... }
  ],
  "exported_at": "2025-10-08T15:30:00",
  "filters": { "user_id": 5 }
}
```

---

## ✅ Testing Checklist

- [x] Backend acepta parámetro `user_id` en `/api/orders/export`
- [x] Backend filtra correctamente por `user_id`
- [x] Frontend pasa los filtros activos al exportar
- [x] Nombre del archivo incluye `user_id` cuando hay filtro
- [x] Sin filtro activo, se exportan todos los pedidos
- [x] Con filtro activo, se exportan solo los pedidos filtrados

---

## 📊 Resumen

| Estado                   | Exportación                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| **Sin filtro**           | Todos los pedidos → `orders_export_2025-10-08.json`                  |
| **Con filtro user_id=5** | Solo pedidos del usuario #5 → `orders_export_2025-10-08_user_5.json` |

---

## 🎉 Resultado

Ahora la funcionalidad de exportación es **consistente** con lo que el usuario está viendo en pantalla. Si está filtrando por un usuario específico, la exportación respeta ese filtro automáticamente.

**Filosofía:** _"What You See Is What You Export"_ (WYSIWYE) 📦
