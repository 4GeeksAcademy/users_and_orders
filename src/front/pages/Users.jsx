import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { UserForm } from "../components/UserForm";
import { UserTable } from "../components/UserTable";
import { EditUserModal } from "../components/EditUserModal";
import { Pagination } from "../components/Pagination";
import { UserBatchUpload } from "../components/UserBatchUpload";
import apiService from "../services/apiService";
import "./Users.css";

export const Users = () => {
  const navigate = useNavigate();

  // Usar el hook personalizado para gestionar usuarios
  const { users, pagination, loading, error, createUser, updateUser, deleteUser, changePage, setError, fetchUsers } = useUsers();

  // Estados locales para el formulario
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

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

  // Manejar apertura del modal de edición
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Manejar guardado de edición
  const handleSaveEdit = async (userData) => {
    setEditLoading(true);
    setSuccess(null);

    const result = await updateUser(editingUser.id, userData);

    if (result.success) {
      setSuccess(`Usuario "${result.user.name}" actualizado exitosamente!`);
      setEditingUser(null);

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);
      setEditLoading(false);
      return {}; // Sin errores
    } else {
      setEditLoading(false);
      // Retornar el error para que el modal lo maneje
      return { email: result.error };
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async (userId) => {
    setError(null);
    setSuccess(null);

    const result = await deleteUser(userId);

    if (result.success) {
      setSuccess("Usuario eliminado exitosamente!");

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(`Error al eliminar usuario: ${result.error}`);
    }
  };

  // Manejar carga masiva de usuarios
  const handleBatchUpload = async (batchData) => {
    try {
      const response = await apiService.users.batchCreate(batchData);

      // Recargar la lista de usuarios
      await fetchUsers(pagination.page);

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Manejar exportación de usuarios
  const handleExportUsers = async () => {
    setExportLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.users.export();

      // Crear archivo JSON para descargar
      const jsonString = JSON.stringify(response, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Crear elemento de descarga temporal
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `usuarios_${timestamp}.json`;

      // Simular click para descargar
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`${response.total} usuarios exportados exitosamente!`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError(`Error al exportar usuarios: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="users-container container mt-5">
      <div className="row">
        {/* Formulario de creación de usuarios */}
        <div className="col-lg-4 mb-4">
          <div className="card users-card">
            <div className="card-header users-header text-white">
              <h5 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Crear Usuario
              </h5>
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

          {/* Botón de carga masiva */}
          <div className="card users-card mt-4">
            <div className="card-body text-center">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => setShowBatchModal(true)}
                disabled={formLoading}
              >
                <i className="fas fa-file-import me-2"></i>
                Carga Masiva de Usuarios
              </button>
              <small className="text-muted d-block mt-2">
                Importar múltiples usuarios desde archivo JSON
              </small>
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
              <div className="d-flex align-items-center gap-2">
                {pagination.total > 0 && (
                  <>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={handleExportUsers}
                      disabled={exportLoading}
                      title="Exportar todos los usuarios a JSON"
                    >
                      {exportLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Exportando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-export me-1"></i>
                          Exportar JSON
                        </>
                      )}
                    </button>
                    <span className="badge bg-light text-dark">
                      Total: {pagination.total}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="card-body">
              <UserTable
                users={users}
                onViewOrders={handleViewOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
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

      {/* Modal de carga masiva */}
      <UserBatchUpload
        show={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onUploadSuccess={handleBatchUpload}
        disabled={formLoading}
      />

      {/* Modal de edición de usuario */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
          loading={editLoading}
        />
      )}
    </div>
  );
};
