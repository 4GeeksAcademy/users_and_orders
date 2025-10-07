import React, { useState } from "react";
import "./Orders.css";
import { useOrders } from "../hooks/useOrders";
import { OrderForm } from "../components/OrderForm";
import { OrderTable } from "../components/OrderTable";
import { OrderBatchUpload } from "../components/OrderBatchUpload";
import { Pagination } from "../components/Pagination";

export const Orders = () => {
  const {
    orders,
    loading,
    error,
    pagination,
    createOrder,
    exportOrders,
    batchCreateOrders,
    changePage,
    changePerPage,
  } = useOrders();

  const [successMessage, setSuccessMessage] = useState("");
  const [showBatchUpload, setShowBatchUpload] = useState(false);

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

  return (
    <div className="container-fluid mt-4 orders-page">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-header">
            <h1 className="page-title">
              <i className="fas fa-shopping-cart me-3"></i>
              Gestión de Pedidos
            </h1>
            <div className="header-actions">
              <button
                className="btn btn-outline-success me-2"
                onClick={handleExport}
                disabled={loading || orders.length === 0}
                title="Exportar todos los pedidos a JSON"
              >
                <i className="fas fa-download me-2"></i>
                Exportar JSON
              </button>
              <button
                className="btn btn-info"
                onClick={() => setShowBatchUpload(!showBatchUpload)}
                disabled={loading}
              >
                <i className={`fas fa-${showBatchUpload ? 'times' : 'upload'} me-2`}></i>
                {showBatchUpload ? 'Cerrar Carga Masiva' : 'Carga Masiva'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito */}
      {successMessage && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage("")}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Carga masiva (condicional) */}
      {showBatchUpload && (
        <div className="row mb-4">
          <div className="col-12">
            <OrderBatchUpload onBatchUpload={handleBatchUpload} />
          </div>
        </div>
      )}

      {/* Formulario de creación */}
      <div className="row mb-4">
        <div className="col-12">
          <OrderForm onOrderCreated={handleOrderCreated} />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="stats-card">
            <div className="stat-item">
              <i className="fas fa-shopping-cart stat-icon"></i>
              <div className="stat-content">
                <div className="stat-value">{pagination.total}</div>
                <div className="stat-label">Total de Pedidos</div>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-box-open stat-icon"></i>
              <div className="stat-content">
                <div className="stat-value">{orders.length}</div>
                <div className="stat-label">En esta página</div>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-file-alt stat-icon"></i>
              <div className="stat-content">
                <div className="stat-value">{pagination.total_pages}</div>
                <div className="stat-label">Páginas totales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista de Pedidos
              </h5>
            </div>
            <div className="card-body">
              <OrderTable orders={orders} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {!loading && orders.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={changePage}
              itemsPerPage={pagination.per_page}
              totalItems={pagination.total}
            />
          </div>
        </div>
      )}
    </div>
  );
};
