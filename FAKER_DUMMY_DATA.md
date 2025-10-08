# 🎲 Generación de Datos Dummy con Faker

## 📝 Descripción

Se ha implementado la funcionalidad de generación de datos de prueba (dummy data) usando la librería **[@faker-js/faker](https://fakerjs.dev/)**, cumpliendo con el requerimiento extra de la prueba técnica.

## ✨ Características Implementadas

### 🔹 UserBatchUpload Component

El componente de carga masiva de usuarios ahora incluye botones para generar datos de prueba automáticamente:

- **Generar 5 usuarios**: Ideal para pruebas rápidas
- **Generar 10 usuarios**: Cantidad estándar para pruebas
- **Generar 25 usuarios**: Pruebas con volumen medio
- **Generar 50 usuarios**: Pruebas con mayor volumen
- **Generar 100 usuarios**: Pruebas de carga considerable

#### Datos Generados para Usuarios:

- **name**: Nombres completos realistas (ej: "John Doe", "Jane Smith")
- **email**: Emails válidos y únicos (ej: "john.doe@example.com")

### 🔹 OrderBatchUpload Component

El componente de carga masiva de pedidos también incluye generación de datos dummy:

- **Generar 10 pedidos**
- **Generar 25 pedidos**
- **Generar 50 pedidos**
- **Generar 100 pedidos**
- **Generar 250 pedidos**

#### Datos Generados para Pedidos:

- **user_id**: IDs de usuarios existentes en la base de datos
- **product_name**: Nombres de productos realistas del catálogo de Faker Commerce
- **amount**: Cantidades aleatorias entre 1 y 20 unidades

## 🚀 Cómo Usar

### Para Generar Usuarios de Prueba:

1. Navega a la página de **Usuarios**
2. Haz clic en el botón **"Carga Masiva"** (ícono de upload)
3. En el modal que se abre, verás una sección **"Generar Datos de Prueba (Faker)"**
4. Selecciona la cantidad de usuarios que deseas generar (5, 10, 25, 50 o 100)
5. Los datos generados aparecerán en la vista previa
6. Haz clic en **"Cargar Usuarios"** para crear los usuarios en la base de datos

### Para Generar Pedidos de Prueba:

1. Navega a la página de **Pedidos**
2. Haz clic en el botón **"Carga Masiva"** (ícono de upload)
3. En el modal que se abre, verás una sección **"Generar Datos de Prueba (Faker)"**
4. El sistema mostrará cuántos usuarios están disponibles
5. Selecciona la cantidad de pedidos que deseas generar (10, 25, 50, 100 o 250)
6. Los datos generados aparecerán en la vista previa
7. Haz clic en **"Cargar Pedidos"** para crear los pedidos en la base de datos

## 🛠️ Detalles Técnicos

### Instalación de Dependencias

```bash
npm install @faker-js/faker --save-dev
```

### Integración en el Código

#### UserBatchUpload.jsx

```javascript
import { faker } from "@faker-js/faker";

const handleGenerateDummyData = (count = 10) => {
  const dummyUsers = Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
  }));

  validateUsers(dummyUsers);
  setPreview(dummyUsers);
};
```

#### OrderBatchUpload.jsx

```javascript
import { faker } from "@faker-js/faker";

const handleGenerateDummyData = (count = 10) => {
  const userIds =
    availableUserIds.length > 0 ? availableUserIds : [1, 2, 3, 4, 5];

  const dummyOrders = Array.from({ length: count }, () => ({
    user_id: faker.helpers.arrayElement(userIds),
    product_name: faker.commerce.productName(),
    amount: faker.number.int({ min: 1, max: 20 }),
  }));

  validateOrders(dummyOrders);
  setPreview(dummyOrders);
};
```

## 🎯 Ventajas de Usar Faker

1. **Datos Realistas**: Los datos generados son realistas y variados
2. **Ahorro de Tiempo**: No es necesario crear archivos JSON manualmente
3. **Testing Rápido**: Permite probar rápidamente con diferentes volúmenes de datos
4. **Validación**: Los datos generados pasan automáticamente las validaciones del sistema
5. **Consistencia**: Siempre genera datos en el formato correcto

## 📊 Ejemplos de Datos Generados

### Usuarios de Ejemplo:

```json
[
  {
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@example.com"
  },
  {
    "name": "Michael Anderson",
    "email": "michael.anderson@example.net"
  },
  {
    "name": "Emily Davis PhD",
    "email": "emily.davis@example.org"
  }
]
```

### Pedidos de Ejemplo:

```json
[
  {
    "user_id": 5,
    "product_name": "Refined Steel Table",
    "amount": 3
  },
  {
    "user_id": 2,
    "product_name": "Handcrafted Cotton Shirt",
    "amount": 12
  },
  {
    "user_id": 8,
    "product_name": "Ergonomic Plastic Chair",
    "amount": 7
  }
]
```

## 🎨 Interfaz de Usuario

- **Icono distintivo**: ⭐ Icono de "magic wand" para indicar generación automática
- **Color de advertencia**: Sección con borde amarillo para distinguirla de las demás opciones
- **Múltiples opciones**: Botones con diferentes cantidades predefinidas
- **Feedback visual**: Muestra la cantidad de usuarios disponibles para pedidos
- **Vista previa**: Los datos generados se muestran en la tabla de previsualización antes de cargar

## ✅ Validaciones

Todos los datos generados pasan por las mismas validaciones que los datos cargados desde archivos JSON:

- **Usuarios**: Validación de formato de email, nombres no vacíos
- **Pedidos**: Validación de user_id existente, amount > 0, product_name válido
- **Límites**: Respeta el límite máximo de 1000 registros por carga

## 🔄 Flujo de Trabajo Recomendado

1. **Paso 1**: Genera usuarios de prueba (ej: 50 usuarios)
2. **Paso 2**: Verifica que los usuarios se crearon correctamente
3. **Paso 3**: Genera pedidos de prueba (ej: 100 pedidos)
4. **Paso 4**: Los pedidos se asignarán automáticamente a los usuarios existentes
5. **Paso 5**: Prueba las funcionalidades de búsqueda, filtrado, exportación, etc.

## 📚 Referencias

- **Faker.js Documentation**: https://fakerjs.dev/
- **API Methods Used**:
  - `faker.person.fullName()`: Genera nombres completos
  - `faker.internet.email()`: Genera emails válidos
  - `faker.commerce.productName()`: Genera nombres de productos
  - `faker.commerce.product()`: Genera tipos de productos
  - `faker.commerce.productAdjective()`: Genera adjetivos para productos
  - `faker.number.int()`: Genera números enteros
  - `faker.helpers.arrayElement()`: Selecciona elemento aleatorio de un array

---

**Nota**: Esta funcionalidad cumple con el punto extra de la prueba técnica: _"Uso de data dummy con librerías como faker o mockaroo para generar datos de prueba."_
