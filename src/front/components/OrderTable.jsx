import React from "react";
import "./OrderTable.css";

export const OrderTable = ({ orders, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando pedidos...</span>
                </div>
                <p className="mt-3 text-muted">Cargando pedidos...</p>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="alert alert-info text-center" role="alert">
                <i className="fas fa-info-circle me-2"></i>
                No hay pedidos registrados. Crea el primero usando el formulario arriba.
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover order-table">
                <thead className="table-success">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">
                            <i className="fas fa-user me-2"></i>
                            Usuario
                        </th>
                        <th scope="col">
                            <i className="fas fa-box me-2"></i>
                            Producto
                        </th>
                        <th scope="col">
                            <i className="fas fa-sort-numeric-up me-2"></i>
                            Cantidad
                        </th>
                        <th scope="col">
                            <i className="fas fa-calendar me-2"></i>
                            Fecha de Creación
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="order-row">
                            <td className="order-id">
                                <span className="badge bg-success">{order.id}</span>
                            </td>
                            <td className="user-info">
                                <div className="user-details">
                                    <div className="user-avatar">
                                        <i className="fas fa-user-circle"></i>
                                    </div>
                                    <div className="user-text">
                                        <div className="user-name">{order.user_name}</div>
                                        <small className="text-muted">ID: {order.user_id}</small>
                                    </div>
                                </div>
                            </td>
                            <td className="product-name">
                                <i className="fas fa-tag me-2 text-success"></i>
                                {order.product_name}
                            </td>
                            <td className="amount">
                                <span className="badge bg-success-subtle text-success">
                                    {formatAmount(order.amount)}
                                </span>
                            </td>
                            <td className="created-date">
                                <small className="text-muted">{formatDate(order.created_at)}</small>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
