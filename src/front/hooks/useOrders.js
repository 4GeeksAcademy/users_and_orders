import { useState, useEffect } from "react";
import apiService from "../services/apiService";

/**
 * Hook personalizado para gestionar pedidos
 * Maneja el estado de pedidos, loading, errores y paginación
 * @param {Object} initialFilters - Filtros iniciales opcionales (ej: { user_id: 1 })
 */
export const useOrders = (initialFilters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  /**
   * Obtener todos los pedidos con paginación y filtros
   */
  const fetchOrders = async (
    page = 1,
    per_page = 10,
    currentFilters = filters
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        per_page,
        ...currentFilters, // Incluir filtros en los parámetros
      };

      const response = await apiService.orders.getAll(params);
      setOrders(response.orders);
      setPagination({
        page: response.page,
        per_page: response.per_page,
        total: response.total,
        total_pages: response.total_pages,
      });
    } catch (err) {
      setError(err.message || "Error al cargar los pedidos");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplicar nuevos filtros
   */
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Resetear a página 1
    fetchOrders(1, pagination.per_page, newFilters);
  };

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setFilters({});
    setPagination({ ...pagination, page: 1 });
    fetchOrders(1, pagination.per_page, {});
  };

  /**
   * Crear un nuevo pedido
   */
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const newOrder = await apiService.orders.create(orderData);
      // Recargar la lista de pedidos después de crear uno nuevo
      await fetchOrders(pagination.page, pagination.per_page, filters);
      return newOrder;
    } catch (err) {
      setError(err.message || "Error al crear el pedido");
      console.error("Error creating order:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exportar pedidos a JSON (respeta filtros activos)
   */
  const exportOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      // Pasar los filtros activos al exportar
      const response = await apiService.orders.export(filters);

      // Crear un archivo JSON para descargar
      const dataStr = JSON.stringify(response.orders, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      // Nombre del archivo dinámico según filtros
      let fileName = `orders_export_${new Date().toISOString().split("T")[0]}`;
      if (filters.user_id) {
        fileName += `_user_${filters.user_id}`;
      }
      fileName += ".json";

      // Crear enlace de descarga
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL
      URL.revokeObjectURL(url);

      return response;
    } catch (err) {
      setError(err.message || "Error al exportar pedidos");
      console.error("Error exporting orders:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear múltiples pedidos desde un archivo JSON
   */
  const batchCreateOrders = async (ordersData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.orders.batchCreate({
        orders: ordersData,
      });

      // Recargar la lista después de la carga masiva
      await fetchOrders(pagination.page, pagination.per_page, filters);

      return response;
    } catch (err) {
      setError(err.message || "Error en la carga masiva de pedidos");
      console.error("Error batch creating orders:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar el estado de un pedido
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await apiService.orders.updateStatus(
        orderId,
        newStatus
      );

      // Recargar la lista de pedidos después de actualizar
      await fetchOrders(pagination.page, pagination.per_page, filters);

      return updatedOrder;
    } catch (err) {
      setError(err.message || "Error al actualizar el estado del pedido");
      console.error("Error updating order status:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar de página
   */
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchOrders(newPage, pagination.per_page, filters);
    }
  };

  /**
   * Cambiar elementos por página
   */
  const changePerPage = (newPerPage) => {
    fetchOrders(1, newPerPage, filters);
  };

  // Cargar pedidos iniciales
  useEffect(() => {
    fetchOrders(1, pagination.per_page, filters);
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    fetchOrders,
    createOrder,
    exportOrders,
    batchCreateOrders,
    updateOrderStatus,
    changePage,
    changePerPage,
    applyFilters,
    clearFilters,
  };
};

export default useOrders;
