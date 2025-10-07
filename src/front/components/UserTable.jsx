import React, { useState } from "react";
import "./UserTable.css";

/**
 * Componente de tabla de usuarios
 * @param {Array} users - Lista de usuarios a mostrar
 * @param {Function} onViewOrders - Función a ejecutar al hacer click en "Ver Pedidos"
 * @param {boolean} loading - Estado de carga
 */
export const UserTable = ({ users, onViewOrders, loading = false }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Manejar click en el nombre del usuario
    const handleUserNameClick = (event, user) => {
        setSelectedUser(user);
    };

    // Cerrar el popover
    const handleClosePopover = () => {
        setSelectedUser(null);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando usuarios...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="alert users-info-alert text-center" role="alert">
                <i className="fas fa-info-circle me-2"></i>
                No hay usuarios registrados. ¡Crea el primero!
            </div>
        );
    }

    return (
        <>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <th scope="row">{user.id}</th>
                                <td className="text-start">
                                    <span
                                        className="user-name-clickable d-inline-flex align-items-center gap-2"
                                        onClick={(e) => handleUserNameClick(e, user)}
                                        title="Click para ver detalles"
                                    >
                                        <i className="fas fa-user-circle text-primary"></i>
                                        {user.name}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => onViewOrders(user.id, user.name)}
                                        title={`Ver pedidos de ${user.name}`}
                                    >
                                        <i className="fas fa-shopping-cart me-1"></i>
                                        Ver Pedidos
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Overlay y Popover flotante con detalles del usuario */}
            {selectedUser && (
                <>
                    <div
                        className="user-popover-overlay"
                        onClick={handleClosePopover}
                    />
                    <div
                        className="user-popover"
                    >
                        <div className="user-popover-header">
                            <h6 className="user-popover-title">
                                <i className="fas fa-user-circle me-2"></i>
                                {selectedUser.name}
                            </h6>
                        </div>
                        <div className="user-popover-body">
                            <div className="user-popover-item">
                                <i className="fas fa-envelope text-muted me-2"></i>
                                <strong>Email:</strong>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="user-popover-item">
                                <i className="fas fa-calendar text-muted me-2"></i>
                                <strong>Registro:</strong>
                                <span>{formatDate(selectedUser.created_at)}</span>
                            </div>
                            <div className="user-popover-item">
                                <i className="fas fa-shopping-bag text-muted me-2"></i>
                                <strong>Pedidos:</strong>
                                <span className="badge">{selectedUser.order_count || 0}</span>
                            </div>
                        </div>
                        <div className="user-popover-footer">
                            <button
                                className="btn btn-sm btn-secondary w-100"
                                onClick={handleClosePopover}
                            >
                                <i className="fas fa-times me-2"></i>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
