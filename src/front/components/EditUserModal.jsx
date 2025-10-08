import React, { useState, useEffect } from "react";
import "./EditUserModal.css";

/**
 * Modal de edición de usuario con validación en tiempo real
 * 
 * Implementa patrón de formulario controlado con validación client-side
 * y manejo de errores del servidor. Optimiza peticiones enviando únicamente
 * los campos modificados (PATCH semántico).
 * 
 * @param {Object} user - Entidad usuario con propiedades name y email
 * @param {Function} onSave - Callback async que recibe delta de cambios y retorna errores de API
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {boolean} loading - Flag de estado de petición HTTP en curso
 */
export const EditUserModal = ({ user, onSave, onClose, loading = false }) => {
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [errors, setErrors] = useState({});

    // Patrón de expresión regular RFC 5322 simplificado para validación de email
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Sincroniza estado del formulario con prop user al montar o cambiar usuario
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    /**
     * Actualiza campo del formulario y limpia su error asociado
     * Implementa validación lazy (solo al submit) para mejor UX
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    /**
     * Valida campos del formulario según reglas de negocio
     * @returns {boolean} true si todos los campos son válidos
     */
    const validateForm = () => {
        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name = "El nombre es requerido";
        }

        if (!formData.email.trim()) {
            validationErrors.email = "El email es requerido";
        } else if (!EMAIL_REGEX.test(formData.email)) {
            validationErrors.email = "El formato del email no es válido";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    /**
     * Calcula delta de cambios entre estado actual y original
     * Optimización: envía solo campos modificados (reduce payload)
     */
    const getChangedFields = () => {
        const delta = {};

        if (formData.name !== user.name) {
            delta.name = formData.name.trim();
        }
        if (formData.email !== user.email) {
            delta.email = formData.email.trim();
        }

        return delta;
    };

    /**
     * Procesa submit del formulario con validación client-side
     * y manejo de errores del servidor (ej: email duplicado)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const changedFields = getChangedFields();

        // Propagación de errores desde API al estado local del formulario
        const apiErrors = await onSave(changedFields);

        if (apiErrors?.email) {
            setErrors(prev => ({ ...prev, email: apiErrors.email }));
        }
    };

    // Guard clause: no renderizar si no hay usuario seleccionado
    if (!user) return null;

    return (
        <>
            {/* Overlay semitransparente - cierra modal al hacer click fuera */}
            <div className="modal-overlay" onClick={onClose} />

            <div className="edit-user-modal">
                {/* Header con título y botón de cierre */}
                <header className="modal-header">
                    <h5 className="modal-title">
                        <i className="fas fa-user-edit me-2" aria-hidden="true"></i>
                        Editar Usuario
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Cerrar modal"
                    >
                        <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                </header>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">
                        {/* Input de nombre con validación visual */}
                        <div className="form-group">
                            <label htmlFor="edit-name" className="form-label">
                                <i className="fas fa-user me-2" aria-hidden="true"></i>
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="edit-name"
                                name="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={loading}
                                placeholder="Ingrese el nombre"
                                autoComplete="name"
                            />
                            {errors.name && (
                                <div className="invalid-feedback" role="alert">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Input de email con validación HTML5 y custom */}
                        <div className="form-group">
                            <label htmlFor="edit-email" className="form-label">
                                <i className="fas fa-envelope me-2" aria-hidden="true"></i>
                                Email
                            </label>
                            <input
                                type="email"
                                id="edit-email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={loading}
                                placeholder="usuario@ejemplo.com"
                                autoComplete="email"
                            />
                            {errors.email && (
                                <div className="invalid-feedback" role="alert">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer con acciones del modal */}
                    <footer className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <i className="fas fa-times me-2" aria-hidden="true"></i>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2" aria-hidden="true"></i>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </div>
        </>
    );
};
