import { useState, useEffect } from "react";
import apiService from "../services/apiService";

/**
 * Hook personalizado para gestionar pedidos
 * Maneja el estado de pedidos, loading, errores y paginación
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  /**
   * Obtener todos los pedidos con paginación
   */
  const fetchOrders = async (page = 1, per_page = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.orders.getAll({ page, per_page });
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
   * Crear un nuevo pedido
   */
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const newOrder = await apiService.orders.create(orderData);
      // Recargar la lista de pedidos después de crear uno nuevo
      await fetchOrders(pagination.page, pagination.per_page);
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
   * Exportar todos los pedidos a JSON
   */
  const exportOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.orders.export();

      // Crear un archivo JSON para descargar
      const dataStr = JSON.stringify(response.orders, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      // Crear enlace de descarga
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_export_${
        new Date().toISOString().split("T")[0]
      }.json`;
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
      await fetchOrders(pagination.page, pagination.per_page);

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
      await fetchOrders(pagination.page, pagination.per_page);

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
      fetchOrders(newPage, pagination.per_page);
    }
  };

  /**
   * Cambiar elementos por página
   */
  const changePerPage = (newPerPage) => {
    fetchOrders(1, newPerPage);
  };

  // Cargar pedidos iniciales
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    createOrder,
    exportOrders,
    batchCreateOrders,
    updateOrderStatus,
    changePage,
    changePerPage,
  };
};

export default useOrders;
