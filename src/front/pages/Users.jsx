import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { UserForm } from "../components/UserForm";
import { UserTable } from "../components/UserTable";
import { Pagination } from "../components/Pagination";
import "./Users.css";

export const Users = () => {
  const navigate = useNavigate();

  // Usar el hook personalizado para gestionar usuarios
  const { users, pagination, loading, error, createUser, changePage, setError } = useUsers();

  // Estados locales para el formulario
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Manejar envío del formulario
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);
    setSuccess(null);

    const result = await createUser(formData);

    if (result.success) {
      setSuccess(`Usuario "${result.user.name}" creado exitosamente!`);

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(`Error al crear usuario: ${result.error}`);
    }

    setFormLoading(false);
    return result.success;
  };

  // Navegar a la página de pedidos de un usuario
  const handleViewOrders = (userId, userName) => {
    navigate(`/orders?user_id=${userId}&user_name=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="users-container container mt-5">
      <div className="row">
        {/* Formulario de creación de usuarios */}
        <div className="col-lg-4 mb-4">
          <div className="card users-card">
            <div className="card-header users-header text-white">
              <h4 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Crear Usuario
              </h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}

              <UserForm onSubmit={handleFormSubmit} loading={formLoading} />
            </div>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="col-lg-8">
          <div className="card users-card">
            <div className="card-header users-header text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Lista de Usuarios
              </h4>
              {pagination.total > 0 && (
                <span className="badge bg-light text-dark">
                  Total: {pagination.total}
                </span>
              )}
            </div>
            <div className="card-body">
              <UserTable
                users={users}
                onViewOrders={handleViewOrders}
                loading={loading}
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
    </div>
  );
};
