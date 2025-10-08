import React, { useState } from "react";

/**
 * Componente de formulario para crear usuarios
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 * @param {boolean} loading - Estado de carga del formulario
 */
export const UserForm = ({ onSubmit, loading = false }) => {
    // Estados del formulario
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const [formErrors, setFormErrors] = useState({});

    // Validar formulario en el cliente
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "El nombre es requerido";
        }

        if (!formData.email.trim()) {
            errors.email = "El email es requerido";
        } else {
            // Validar formato de email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = "Formato de email inválido";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        // Ejecutar función de envío
        const success = await onSubmit(formData);

        // Si fue exitoso, limpiar el formulario
        if (success) {
            setFormData({ name: "", email: "" });
            setFormErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Nombre <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre"
                    disabled={loading}
                />
                {formErrors.name && (
                    <div className="invalid-feedback">
                        {formErrors.name}
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                </label>
                <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="usuario@ejemplo.com"
                    disabled={loading}
                />
                {formErrors.email && (
                    <div className="invalid-feedback">
                        {formErrors.email}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando...
                    </>
                ) : (
                    <>
                        <i className="fas fa-save me-2"></i>
                        Crear Usuario
                    </>
                )}
            </button>
        </form>
    );
};
