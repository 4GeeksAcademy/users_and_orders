import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";

export const OrderForm = ({ onOrderCreated }) => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [formData, setFormData] = useState({
        user_id: "",
        product_name: "",
        amount: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            // Obtener todos los usuarios sin paginación (o con una página grande)
            const response = await apiService.users.getAll({ per_page: 100 });
            setUsers(response.users);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.user_id) {
            newErrors.user_id = "Debes seleccionar un usuario";
        }

        if (!formData.product_name.trim()) {
            newErrors.product_name = "El nombre del producto es requerido";
        } else if (formData.product_name.trim().length < 3) {
            newErrors.product_name = "El nombre del producto debe tener al menos 3 caracteres";
        }

        if (!formData.amount) {
            newErrors.amount = "La cantidad es requerida";
        } else if (!/^\d+$/.test(formData.amount) || parseInt(formData.amount) <= 0) {
            newErrors.amount = "La cantidad debe ser un número entero mayor que 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                user_id: parseInt(formData.user_id),
                product_name: formData.product_name.trim(),
                amount: parseInt(formData.amount, 10),
            };

            await onOrderCreated(orderData);

            // Limpiar formulario después del éxito
            setFormData({
                user_id: "",
                product_name: "",
                amount: "",
            });
            setErrors({});
        } catch (error) {
            // El error se maneja en el componente padre
            console.error("Error submitting order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                    <i className="fas fa-plus-circle me-2"></i>
                    Crear Pedido
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {/* Usuario */}
                    <div className="mb-3">
                        <label htmlFor="user_id" className="form-label">
                            Usuario <span className="text-danger">*</span>
                        </label>
                        <select
                            className={`form-select ${errors.user_id ? "is-invalid" : ""}`}
                            id="user_id"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            disabled={loadingUsers || isSubmitting}
                        >
                            <option value="">
                                {loadingUsers ? "Cargando usuarios..." : "Selecciona un usuario"}
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {errors.user_id && (
                            <div className="invalid-feedback">{errors.user_id}</div>
                        )}
                    </div>
                    {/* Nombre del Producto */}
                    <div className="mb-3">
                        <label htmlFor="product_name" className="form-label">
                            Nombre del Producto <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.product_name ? "is-invalid" : ""}`}
                            id="product_name"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            placeholder="Ej: Laptop, Mouse, Teclado"
                            disabled={isSubmitting}
                        />
                        {errors.product_name && (
                            <div className="invalid-feedback">{errors.product_name}</div>
                        )}
                    </div>
                    {/* Cantidad */}
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                            Cantidad <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Ej: 5"
                            min="1"
                            step="1"
                            disabled={isSubmitting}
                        />
                        {errors.amount && (
                            <div className="invalid-feedback">{errors.amount}</div>
                        )}
                    </div>
                    {/* Botón Submit */}
                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isSubmitting || loadingUsers}
                        >
                            {isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Creando Pedido...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check me-2"></i>
                                    Crear Pedido
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
