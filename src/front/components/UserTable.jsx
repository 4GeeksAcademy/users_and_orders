import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserTable.css";

/**
 * Componente de tabla de usuarios
 * @param {Array} users - Lista de usuarios a mostrar
 * @param {Function} onViewOrders - Función a ejecutar al hacer click en "Ver Pedidos" (DEPRECATED - ahora usa navegación)
 * @param {Function} onEdit - Función a ejecutar al hacer click en "Editar"
 * @param {Function} onDelete - Función a ejecutar al hacer click en "Eliminar"
 * @param {boolean} loading - Estado de carga
 */
export const UserTable = ({ users, onViewOrders, onEdit, onDelete, loading = false }) => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showTooltip, setShowTooltip] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

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

    // Manejar navegación a pedidos del usuario
    const handleViewOrders = (userId, userName) => {
        navigate(`/orders?user_id=${userId}&user_name=${encodeURIComponent(userName)}`);
    };

    // Manejar click en el nombre del usuario
    const handleUserNameClick = (event, user) => {
        setSelectedUser(user);
    };

    // Cerrar el popover
    const handleClosePopover = () => {
        setSelectedUser(null);
    };

    // Manejar click en editar
    const handleEdit = (e, user) => {
        e.stopPropagation();
        onEdit(user);
    };

    // Manejar click en eliminar
    const handleDelete = (e, user) => {
        e.stopPropagation();

        // Verificar si el usuario tiene pedidos
        if (user.order_count > 0) {
            return; // El botón ya está deshabilitado, pero por si acaso
        }

        // Abrir modal de confirmación
        setUserToDelete(user);
    };

    // Confirmar eliminación
    const confirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete.id);
            setUserToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDelete = () => {
        setUserToDelete(null);
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
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleViewOrders(user.id, user.name)}
                                            title={`Ver pedidos de ${user.name}`}
                                        >
                                            <i className="fas fa-shopping-cart me-1"></i>
                                            Pedidos
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={(e) => handleEdit(e, user)}
                                            title={`Editar ${user.name}`}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <div
                                            className="position-relative d-inline-block"
                                            onMouseEnter={() => user.order_count > 0 && setShowTooltip(user.id)}
                                            onMouseLeave={() => setShowTooltip(null)}
                                        >
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={(e) => handleDelete(e, user)}
                                                title={user.order_count > 0 ? '' : `Eliminar ${user.name}`}
                                                disabled={user.order_count > 0}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            {showTooltip === user.id && user.order_count > 0 && (
                                                <div className="delete-tooltip">
                                                    <i className="fas fa-exclamation-triangle me-1"></i>
                                                    No se puede eliminar: tiene {user.order_count} pedido{user.order_count > 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

            {/* Modal de confirmación de eliminación */}
            {userToDelete && (
                <>
                    <div
                        className="delete-modal-overlay"
                        onClick={cancelDelete}
                    />
                    <div className="delete-modal">
                        <div className="delete-modal-header">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="delete-modal-body">
                            <h5 className="delete-modal-title">Confirmar Eliminación</h5>
                            <p className="delete-modal-message">
                                ¿Está seguro que desea eliminar al usuario <strong>"{userToDelete.name}"</strong>?
                            </p>
                            <p className="delete-modal-warning">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="delete-modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={cancelDelete}
                            >
                                <i className="fas fa-times me-2"></i>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmDelete}
                            >
                                <i className="fas fa-trash me-2"></i>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
