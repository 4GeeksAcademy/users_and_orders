// Servicio centralizado para todas las llamadas al backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Función auxiliar para manejar respuestas de la API
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `Error ${response.status}`);
  }
  return data;
};

// Función auxiliar para hacer peticiones
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

// Función auxiliar para construir query strings
const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, value);
    }
  });
  return query.toString() ? `?${query.toString()}` : "";
};

// ========== API Service ==========
export const apiService = {
  // ========== Test de conexión ==========
  hello: () => request("/api/hello"),

  // ========== USUARIOS ==========
  users: {
    /**
     * Listar todos los usuarios con paginación opcional
     * @param {Object} params - Parámetros de paginación
     * @param {number} params.page - Número de página (default: 1)
     * @param {number} params.per_page - Elementos por página (default: 10, max: 100)
     * @returns {Promise} - { users: [], total, page, per_page, total_pages }
     */
    getAll: (params = {}) => {
      const queryString = buildQueryString(params);
      return request(`/api/users${queryString}`);
    },

    /**
     * Crear un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.name - Nombre del usuario (requerido)
     * @param {string} userData.email - Email del usuario (requerido, único, formato válido)
     * @returns {Promise} - Usuario creado
     */
    create: (userData) =>
      request("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      }),

    /**
     * Actualizar un usuario existente
     * @param {number} userId - ID del usuario
     * @param {Object} userData - Datos a actualizar
     * @param {string} userData.name - Nombre del usuario (opcional)
     * @param {string} userData.email - Email del usuario (opcional)
     * @returns {Promise} - Usuario actualizado
     */
    update: (userId, userData) =>
      request(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),

    /**
     * Eliminar un usuario (solo si no tiene pedidos)
     * @param {number} userId - ID del usuario
     * @returns {Promise} - { success, message }
     */
    delete: (userId) =>
      request(`/api/users/${userId}`, {
        method: "DELETE",
      }),

    /**
     * Crear múltiples usuarios en lote desde JSON
     * @param {Object} batchData - Datos del lote
     * @param {Array} batchData.users - Array de objetos con { name, email }
     * @returns {Promise} - { success, created, failed, total_processed, users: [], errors?: [] }
     * @note Máximo 1000 usuarios por lote
     */
    batchCreate: (batchData) =>
      request("/api/users/batch", {
        method: "POST",
        body: JSON.stringify(batchData),
      }),

    /**
     * Obtener todos los pedidos de un usuario específico
     * @param {number} userId - ID del usuario
     * @returns {Promise} - { user, orders: [], total_orders }
     */
    getOrders: (userId) => request(`/api/users/${userId}/orders`),
  },

  // ========== PEDIDOS ==========
  orders: {
    /**
     * Listar todos los pedidos con información del usuario
     * @param {Object} params - Parámetros de paginación
     * @param {number} params.page - Número de página (default: 1)
     * @param {number} params.per_page - Elementos por página (default: 10, max: 100)
     * @returns {Promise} - { orders: [], total, page, per_page, total_pages }
     */
    getAll: (params = {}) => {
      const queryString = buildQueryString(params);
      return request(`/api/orders${queryString}`);
    },

    /**
     * Crear un nuevo pedido
     * @param {Object} orderData - Datos del pedido
     * @param {number} orderData.user_id - ID del usuario (requerido)
     * @param {string} orderData.product_name - Nombre del producto (requerido)
     * @param {number} orderData.amount - Cantidad (requerido, debe ser > 0)
     * @returns {Promise} - Pedido creado
     */
    create: (orderData) =>
      request("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),

    /**
     * Actualizar el estado de un pedido
     * @param {number} orderId - ID del pedido
     * @param {string} status - Nuevo estado (pending, completed, cancelled)
     * @returns {Promise} - Pedido actualizado
     */
    updateStatus: (orderId, status) =>
      request(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    /**
     * Exportar todos los pedidos a JSON
     * @returns {Promise} - { success, total, orders: [], exported_at }
     */
    export: () => request("/api/orders/export"),

    /**
     * Crear múltiples pedidos en lote desde JSON
     * @param {Object} batchData - Datos del lote
     * @param {Array} batchData.orders - Array de objetos con { user_id, product_name, amount }
     * @returns {Promise} - { success, created, failed, total_processed, orders: [], errors?: [] }
     * @note Máximo 1000 pedidos por lote
     */
    batchCreate: (batchData) =>
      request("/api/orders/batch", {
        method: "POST",
        body: JSON.stringify(batchData),
      }),
  },
};

export default apiService;
