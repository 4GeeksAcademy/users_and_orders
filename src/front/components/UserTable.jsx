import React from "react";

/**
 * Componente de tabla de usuarios
 * @param {Array} users - Lista de usuarios a mostrar
 * @param {Function} onViewOrders - Función a ejecutar al hacer click en "Ver Pedidos"
 * @param {boolean} loading - Estado de carga
 */
export const UserTable = ({ users, onViewOrders, loading = false }) => {
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
        <div className="table-responsive">
            <table className="table table-hover">
                <thead className="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Fecha de Registro</th>
                        <th scope="col" className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>
                                <i className="fas fa-user text-primary me-2"></i>
                                {user.name}
                            </td>
                            <td>
                                <i className="fas fa-envelope text-muted me-2"></i>
                                {user.email}
                            </td>
                            <td>
                                <small className="text-muted">
                                    <i className="fas fa-calendar text-muted me-1"></i>
                                    {formatDate(user.created_at)}
                                </small>
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
    );
};
