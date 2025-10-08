import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import "./Orders.css";
import { useOrders } from "../hooks/useOrders";
import { OrderForm } from "../components/OrderForm";
import { OrderTable } from "../components/OrderTable";
import { OrderBatchUpload } from "../components/OrderBatchUpload";
import { Pagination } from "../components/Pagination";
import apiService from "../services/apiService";

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('user_id');
  const userName = searchParams.get('user_name');
  const [availableUserIds, setAvailableUserIds] = useState([]);

  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    searchTerm,
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
  } = useOrders(userId ? { user_id: userId } : {});

  // Usar el contexto de búsqueda
  const { registerSearch, unregisterSearch } = useSearch();

  const [successMessage, setSuccessMessage] = useState("");
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // Cargar usuarios disponibles para datos dummy
  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const response = await apiService.users.getAll({ per_page: 1000 });
        const userIds = response.users.map(user => user.id);
        setAvailableUserIds(userIds);
      } catch (error) {
        console.error("Error fetching users for dummy data:", error);
      }
    };
    
    if (showBatchUpload) {
      fetchAvailableUsers();
    }
  }, [showBatchUpload]);

  // Registrar funciones de búsqueda cuando el componente se monta
  useEffect(() => {
    registerSearch(searchOrders, clearSearch);
    return () => {
      unregisterSearch();
    };
  }, [registerSearch, unregisterSearch, searchOrders, clearSearch]);

  // Aplicar filtro cuando cambie el parámetro de URL
  useEffect(() => {
    if (userId) {
      applyFilters({ user_id: userId });
    } else if (filters.user_id) {
      // Si no hay userId en la URL pero sí en los filtros, limpiar
      clearFilters();
    }
  }, [userId]);

  // Limpiar filtro
  const handleClearFilter = () => {
    clearFilters();
    setSearchParams({}); // Limpiar URL
  };

  // Manejar creación de pedido
  const handleOrderCreated = async (orderData) => {
    try {
      await createOrder(orderData);
      setSuccessMessage("¡Pedido creado exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      // El error ya se muestra en el estado global
      console.error("Error creating order:", error);
    }
  };

  // Manejar exportación de pedidos
  const handleExport = async () => {
    try {
      await exportOrders();
      setSuccessMessage("¡Pedidos exportados exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error exporting orders:", error);
    }
  };

  // Manejar carga masiva
  const handleBatchUpload = async (ordersData) => {
    try {
      const result = await batchCreateOrders(ordersData);
      setSuccessMessage(
        `¡Carga completada! ${result.created} pedidos creados.`
      );
      setTimeout(() => setSuccessMessage(""), 5000);
      return result;
    } catch (error) {
      console.error("Error batch uploading orders:", error);
      throw error;
    }
  };

  // Manejar cambio de estado de pedido
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setSuccessMessage(`¡Estado del pedido actualizado a ${newStatus}!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="orders-container container mt-5">
      {/* Banner de filtro activo */}
      {userId && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-4">
          <span>
            <i className="fas fa-filter me-2"></i>
            Mostrando pedidos de: <strong>{userName || `Usuario #${userId}`}</strong>
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleClearFilter}
          >
            <i className="fas fa-times me-1"></i>
            Ver todos los pedidos
          </button>
        </div>
      )}

      {/* Banner de búsqueda activa */}
      {searchTerm && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-4">
          <span>
            <i className="fas fa-search me-2"></i>
            Buscando: <strong>{searchTerm}</strong>
          </span>
          <button
            className="btn btn-sm btn-outline-info"
            onClick={clearSearch}
          >
            <i className="fas fa-times me-1"></i>
            Limpiar búsqueda
          </button>
        </div>
      )}

      <div className="row">
        {/* Formulario de creación de pedidos */}
        <div className="col-lg-4 mb-4">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage("")}
              ></button>
            </div>
          )}

          <OrderForm onOrderCreated={handleOrderCreated} />

          {/* Botón de carga masiva */}
          <div className="card orders-card mt-4">
            <div className="card-body text-center">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => setShowBatchUpload(!showBatchUpload)}
                disabled={loading}
              >
                <i className="fas fa-file-import me-2"></i>
                Carga Masiva de Pedidos
              </button>
              <small className="text-muted d-block mt-2">
                Importar múltiples pedidos desde archivo JSON
              </small>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="col-lg-8">
          <div className="card orders-card">
            <div className="card-header orders-header text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-shopping-cart me-2"></i>
                Lista de Pedidos
              </h4>
              <div className="d-flex align-items-center gap-2">
                {pagination.total > 0 && (
                  <>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={handleExport}
                      disabled={loading}
                      title="Exportar todos los pedidos a JSON"
                    >
                      <i className="fas fa-file-export me-1"></i>
                      Exportar JSON
                    </button>
                    <span className="badge bg-light text-dark">
                      Total: {pagination.total}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="card-body">
              <OrderTable
                orders={orders}
                loading={loading}
                onStatusChange={handleStatusChange}
              />

              {/* Paginación */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={changePage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de carga masiva */}
      <OrderBatchUpload
        show={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        onBatchUpload={handleBatchUpload}
        disabled={loading}
        availableUserIds={availableUserIds}
      />
    </div>
  );
};
