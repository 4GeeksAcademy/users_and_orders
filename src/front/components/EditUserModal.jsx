import React, { useState, useEffect } from "react";
import "./EditUserModal.css";

/**
 * Modal para editar un usuario
 * @param {Object} user - Usuario a editar
 * @param {Function} onSave - Función a ejecutar al guardar (recibe los datos actualizados)
 * @param {Function} onClose - Función a ejecutar al cerrar el modal
 * @param {boolean} loading - Estado de carga
 */
export const EditUserModal = ({ user, onSave, onClose, loading = false }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [errors, setErrors] = useState({});

    // Inicializar el formulario con los datos del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo al editar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validar el formulario
    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido";
        } else {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "El formato del email no es válido";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Enviar solo los campos que cambiaron
        const updatedData = {};
        if (formData.name !== user.name) {
            updatedData.name = formData.name.trim();
        }
        if (formData.email !== user.email) {
            updatedData.email = formData.email.trim();
        }

        // Espera el resultado del guardado
        const apiErrors = await onSave(updatedData);

        // Si hay error de email duplicado, mostrarlo en el campo email
        if (apiErrors && apiErrors.email) {
            setErrors(prev => ({
                ...prev,
                email: apiErrors.email
            }));
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Overlay */}
            <div className="modal-overlay" onClick={onClose} />

            {/* Modal */}
            <div className="edit-user-modal">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <i className="fas fa-user-edit me-2"></i>
                        Editar Usuario
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Cerrar"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Campo Nombre */}
                        <div className="form-group">
                            <label htmlFor="edit-name" className="form-label">
                                <i className="fas fa-user me-2"></i>
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="edit-name"
                                name="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Ingrese el nombre"
                            />
                            {errors.name && (
                                <div className="invalid-feedback">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Campo Email */}
                        <div className="form-group">
                            <label htmlFor="edit-email" className="form-label">
                                <i className="fas fa-envelope me-2"></i>
                                Email
                            </label>
                            <input
                                type="email"
                                id="edit-email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Ingrese el email"
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <i className="fas fa-times me-2"></i>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2"></i>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
