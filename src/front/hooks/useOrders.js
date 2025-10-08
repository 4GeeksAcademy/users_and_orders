import { useState, useEffect } from "react";
import apiService from "../services/apiService";

/**
 * Hook personalizado para gestión de pedidos
 * Maneja estado, paginación, filtros y operaciones CRUD de pedidos
 */
export const useOrders = (initialFilters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  /**
   * Obtiene pedidos con paginación y filtros aplicados
   */
  const fetchOrders = async (
    page = 1,
    per_page = 10,
    currentFilters = filters,
    search = searchTerm
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, per_page, ...currentFilters };
      if (search) params.search = search;

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
   * Aplica nuevos filtros y reinicia la paginación
   */
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchOrders(1, pagination.per_page, newFilters, searchTerm);
  };

  /**
   * Limpia todos los filtros aplicados
   */
  const clearFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchOrders(1, pagination.per_page, {}, searchTerm);
  };

  /**
   * Busca pedidos por nombre de producto
   */
  const searchOrders = (search) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchOrders(1, pagination.per_page, filters, search);
  };

  /**
   * Limpia el término de búsqueda
   */
  const clearSearch = () => {
    setSearchTerm("");
    fetchOrders(1, pagination.per_page, filters, "");
  };

  /**
   * Crea un nuevo pedido y recarga la lista
   */
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const newOrder = await apiService.orders.create(orderData);
      await fetchOrders(
        pagination.page,
        pagination.per_page,
        filters,
        searchTerm
      );
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
   * Exporta pedidos a JSON respetando los filtros activos
   */
  const exportOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.orders.export(filters);

      // Generar nombre de archivo dinámico
      let fileName = `orders_export_${new Date().toISOString().split("T")[0]}`;
      if (filters.user_id) fileName += `_user_${filters.user_id}`;
      fileName += ".json";

      // Crear y descargar archivo
      const dataBlob = new Blob([JSON.stringify(response.orders, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
   * Crea múltiples pedidos en lote
   */
  const batchCreateOrders = async (ordersData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.orders.batchCreate({
        orders: ordersData,
      });
      await fetchOrders(
        pagination.page,
        pagination.per_page,
        filters,
        searchTerm
      );
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
   * Actualiza el estado de un pedido
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await apiService.orders.updateStatus(
        orderId,
        newStatus
      );
      await fetchOrders(
        pagination.page,
        pagination.per_page,
        filters,
        searchTerm
      );
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
   * Cambia a una página específica
   */
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchOrders(newPage, pagination.per_page, filters, searchTerm);
    }
  };

  /**
   * Cambia la cantidad de elementos por página
   */
  const changePerPage = (newPerPage) => {
    fetchOrders(1, newPerPage, filters, searchTerm);
  };

  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchOrders(1, pagination.per_page, filters, searchTerm);
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    searchTerm,
    fetchOrders,
    createOrder,
    exportOrders,
    batchCreateOrders,
    updateOrderStatus,
    changePage,
    changePerPage,
    applyFilters,
    clearFilters,
    searchOrders,
    clearSearch,
  };
};

export default useOrders;
