/**
 * Servicio centralizado para comunicación con la API
 * Gestiona todas las peticiones HTTP al backend
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// ============== UTILIDADES ==============

/**
 * Procesa la respuesta de la API y maneja errores
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `Error ${response.status}`);
  }
  return data;
};

/**
 * Realiza peticiones HTTP a la API
 */
const request = async (endpoint, options = {}) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("VITE_BACKEND_URL is not defined in .env file");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Construye query string a partir de un objeto de parámetros
 */
const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString() ? `?${query.toString()}` : "";
};

// ============== API SERVICE ==============

export const apiService = {
  // Endpoint de prueba
  hello: () => request("/api/hello"),

  // ========== USUARIOS ==========
  users: {
    // Obtener lista de usuarios (con paginación y búsqueda)
    getAll: (params = {}) => {
      const queryString = buildQueryString(params);
      return request(`/api/users${queryString}`);
    },

    // Crear un usuario
    create: (userData) =>
      request("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      }),

    // Actualizar un usuario
    update: (userId, userData) =>
      request(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),

    // Eliminar un usuario (solo si no tiene pedidos)
    delete: (userId) =>
      request(`/api/users/${userId}`, {
        method: "DELETE",
      }),

    // Crear usuarios en lote
    batchCreate: (batchData) =>
      request("/api/users/batch", {
        method: "POST",
        body: JSON.stringify(batchData),
      }),

    // Obtener pedidos de un usuario
    getOrders: (userId) => request(`/api/users/${userId}/orders`),

    // Exportar usuarios a JSON
    export: () => request("/api/users/export"),
  },

  // ========== PEDIDOS ==========
  orders: {
    // Obtener lista de pedidos (con paginación y búsqueda)
    getAll: (params = {}) => {
      const queryString = buildQueryString(params);
      return request(`/api/orders${queryString}`);
    },

    // Crear un pedido
    create: (orderData) =>
      request("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),

    // Actualizar estado de un pedido
    updateStatus: (orderId, status) =>
      request(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    // Exportar pedidos a JSON (con filtros opcionales)
    export: (params = {}) =>
      request(`/api/orders/export${buildQueryString(params)}`),

    // Crear pedidos en lote
    batchCreate: (batchData) =>
      request("/api/orders/batch", {
        method: "POST",
        body: JSON.stringify(batchData),
      }),
  },
};

export default apiService;
