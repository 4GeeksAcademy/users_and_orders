import React, { useState, useRef } from "react";
import { faker } from '@faker-js/faker';

/**
 * Componente para carga masiva de pedidos desde archivo JSON con Modal
 * @param {boolean} show - Controla si el modal está visible
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onBatchUpload - Función a ejecutar cuando la carga sea exitosa
 * @param {boolean} disabled - Deshabilitar el componente
 * @param {Array} availableUserIds - IDs de usuarios disponibles para generar datos dummy
 */
export const OrderBatchUpload = ({ show, onClose, onBatchUpload, disabled = false, availableUserIds = [] }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);


    // Validar formato del JSON
    const validateOrders = (orders) => {
        if (!Array.isArray(orders)) {
            throw new Error("El JSON debe contener un array de pedidos");
        }

        if (orders.length === 0) {
            throw new Error("El array de pedidos está vacío");
        }

        if (orders.length > 1000) {
            throw new Error("Máximo 1000 pedidos por carga");
        }

        // Validar estructura de cada pedido
        orders.forEach((order, index) => {
            if (!order.user_id || typeof order.user_id !== 'number') {
                throw new Error(`Pedido en índice ${index}: 'user_id' es requerido y debe ser un número`);
            }
            if (!order.product_name || typeof order.product_name !== 'string') {
                throw new Error(`Pedido en índice ${index}: 'product_name' es requerido y debe ser texto`);
            }
            if (!order.amount || typeof order.amount !== 'number' || order.amount <= 0) {
                throw new Error(`Pedido en índice ${index}: 'amount' es requerido, debe ser un número mayor a 0`);
            }
        });

        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validar tipo de archivo
        if (!selectedFile.name.endsWith('.json')) {
            setError("Por favor selecciona un archivo JSON válido");
            return;
        }

        setFile(selectedFile);
        setError(null);
        setUploadResult(null);

        // Leer y previsualizar el archivo
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);

                // Validar estructura
                let orders;
                if (Array.isArray(json)) {
                    orders = json;
                } else if (json.orders && Array.isArray(json.orders)) {
                    orders = json.orders;
                } else {
                    throw new Error("El JSON debe contener un array de pedidos o un objeto con propiedad 'orders'");
                }

                validateOrders(orders);
                setPreview(orders);
            } catch (err) {
                setError(`Error al leer el archivo: ${err.message}`);
                setFile(null);
                setPreview(null);
            }
        };
        reader.readAsText(selectedFile);
    };


    const handleUpload = async () => {
        if (!preview || preview.length === 0) {
            setError("No hay pedidos para cargar");
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadResult(null);

        try {
            const result = await onBatchUpload(preview);
            setUploadResult(result);

            // Limpiar el input file y preview
            setFile(null);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (error) {
            console.error("Error uploading orders:", error);
            setError(error.message || "Error al procesar el archivo");
        } finally {
            setIsUploading(false);
        }
    };


    const downloadTemplate = () => {
        const template = [
            {
                user_id: 1,
                product_name: "Laptop",
                amount: 2,
            },
            {
                user_id: 1,
                product_name: "Mouse",
                amount: 5,
            },
            {
                user_id: 2,
                product_name: "Teclado",
                amount: 3,
            },
        ];

        const dataStr = JSON.stringify(template, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "orders_template.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // Generar datos dummy con Faker
    const handleGenerateDummyData = (count = 10) => {
        try {
            // Si no hay usuarios disponibles, usar IDs de ejemplo
            const userIds = availableUserIds.length > 0 ? availableUserIds : [1, 2, 3, 4, 5];

            // Lista de productos realistas
            const productCategories = [
                () => faker.commerce.productName(),
                () => `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
                () => faker.commerce.product(),
            ];

            // Generar pedidos con datos realistas usando Faker
            const dummyOrders = Array.from({ length: count }, () => {
                const productGenerator = faker.helpers.arrayElement(productCategories);
                return {
                    user_id: faker.helpers.arrayElement(userIds),
                    product_name: productGenerator(),
                    amount: faker.number.int({ min: 1, max: 20 })
                };
            });

            // Validar los datos generados
            validateOrders(dummyOrders);

            // Establecer el preview con los datos generados
            setPreview(dummyOrders);
            setError(null);
            setUploadResult(null);

            // Crear un "archivo virtual" para mantener consistencia
            setFile({ name: `pedidos_dummy_${count}.json`, type: 'application/json' });

        } catch (err) {
            setError(`Error al generar datos dummy: ${err.message}`);
        }
    };

    const handleClose = () => {
        // Limpiar estados al cerrar
        setFile(null);
        setPreview(null);
        setError(null);
        setUploadResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">
                            <i className="fas fa-upload me-2"></i>
                            Carga Masiva de Pedidos
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleClose}
                            disabled={isUploading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Instrucciones */}
                        <div className="alert alert-info">
                            <h6 className="alert-heading">
                                <i className="fas fa-info-circle me-2"></i>
                                Instrucciones
                            </h6>
                            <ul className="mb-0 small">
                                <li>El archivo debe ser formato JSON</li>
                                <li>Debe contener un array de pedidos</li>
                                <li>Cada pedido debe tener: <code>user_id</code> (número), <code>product_name</code> (texto), <code>amount</code> (número mayor a 0)</li>
                                <li>Máximo 1000 pedidos por carga</li>
                            </ul>
                        </div>

                        {/* Generación de Datos Dummy */}
                        <div className="card mb-3 border-warning">
                            <div className="card-header bg-warning bg-opacity-10">
                                <h6 className="mb-0">
                                    <i className="fas fa-magic me-2"></i>
                                    Generar Datos de Prueba (Faker)
                                </h6>
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-2">
                                    Genera pedidos de prueba con datos realistas usando la librería Faker.
                                    {availableUserIds.length > 0 && (
                                        <span className="text-success ms-1">
                                            ({availableUserIds.length} usuario(s) disponible(s))
                                        </span>
                                    )}
                                </p>
                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleGenerateDummyData(10)}
                                        disabled={isUploading || disabled}
                                    >
                                        <i className="fas fa-shopping-cart me-1"></i>
                                        Generar 10
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleGenerateDummyData(25)}
                                        disabled={isUploading || disabled}
                                    >
                                        <i className="fas fa-shopping-cart me-1"></i>
                                        Generar 25
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleGenerateDummyData(50)}
                                        disabled={isUploading || disabled}
                                    >
                                        <i className="fas fa-shopping-cart me-1"></i>
                                        Generar 50
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleGenerateDummyData(100)}
                                        disabled={isUploading || disabled}
                                    >
                                        <i className="fas fa-shopping-cart me-1"></i>
                                        Generar 100
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleGenerateDummyData(250)}
                                        disabled={isUploading || disabled}
                                    >
                                        <i className="fas fa-shopping-cart me-1"></i>
                                        Generar 250
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mensajes de error */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError(null)}
                                ></button>
                            </div>
                        )}

                        {/* Selector de archivo */}
                        <div className="mb-3">
                            <label className="form-label">
                                <i className="fas fa-file-upload me-2"></i>
                                Seleccionar archivo JSON
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                accept=".json"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                disabled={isUploading || disabled}
                            />
                        </div>

                        {/* Previsualización */}
                        {preview && preview.length > 0 && (
                            <div className="card mb-3">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-eye me-2"></i>
                                        Previsualización ({preview.length} pedidos)
                                    </h6>
                                </div>
                                <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="table table-sm table-hover">
                                        <thead className="sticky-top bg-white">
                                            <tr>
                                                <th>#</th>
                                                <th>User ID</th>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.slice(0, 50).map((order, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{order.user_id}</td>
                                                    <td>{order.product_name}</td>
                                                    <td>{order.amount}</td>
                                                </tr>
                                            ))}
                                            {preview.length > 50 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">
                                                        <em>... y {preview.length - 50} pedidos más</em>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Resultado de la carga */}
                        {uploadResult && (
                            <div className="batch-result-container">
                                {/* Resumen General */}
                                <div className={`alert ${uploadResult.created > 0 ? 'alert-success' : 'alert-warning'} mb-3`} role="alert">
                                    <h6 className="alert-heading mb-3">
                                        <i className={`fas ${uploadResult.created > 0 ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                                        Resumen de la Carga
                                    </h6>
                                    <div className="row text-center">
                                        <div className="col-4">
                                            <div className="border rounded p-2 bg-secondary">
                                                <h4 className="mb-0 text-white">{uploadResult.total_processed}</h4>
                                                <small className="text-white">Total Procesados</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="border rounded p-2 bg-success">
                                                <h4 className="mb-0 text-white">{uploadResult.created}</h4>
                                                <small className="text-white">Exitosos</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="border rounded p-2 bg-danger">
                                                <h4 className="mb-0 text-white">{uploadResult.failed}</h4>
                                                <small className="text-white">Fallidos</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Pedidos Creados Exitosamente */}
                                {uploadResult.orders && uploadResult.orders.length > 0 && (
                                    <div className="card mb-3 border-success">
                                        <div className="card-header border-success">
                                            <details>
                                                <summary className="fw-bold text-success" style={{ cursor: 'pointer', listStyle: 'none' }}>
                                                    <i className="fas fa-chevron-right me-2" style={{ fontSize: '0.8em' }}></i>
                                                    <i className="fas fa-check-circle me-2"></i>
                                                    Pedidos Creados Exitosamente ({uploadResult.orders.length})
                                                </summary>
                                                <div className="mt-3">
                                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                        <table className="table table-sm table-hover mb-0">
                                                            <thead className="table-light sticky-top">
                                                                <tr>
                                                                    <th style={{ width: '60px' }}>ID</th>
                                                                    <th style={{ width: '80px' }}>User ID</th>
                                                                    <th>Producto</th>
                                                                    <th style={{ width: '100px' }}>Cantidad</th>
                                                                    <th style={{ width: '120px' }}>Estado</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {uploadResult.orders.map((order, idx) => (
                                                                    <tr key={order.id || idx}>
                                                                        <td>
                                                                            <span className="badge bg-primary">{order.id}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-info">{order.user_id}</span>
                                                                        </td>
                                                                        <td>
                                                                            <i className="fas fa-box text-success me-2"></i>
                                                                            {order.product_name}
                                                                        </td>
                                                                        <td>
                                                                            <i className="fas fa-hashtag text-muted me-1"></i>
                                                                            <strong>{order.amount}</strong>
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-success">
                                                                                <i className="fas fa-check me-1"></i>
                                                                                Creado
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                )}

                                {/* Lista de Pedidos Fallidos */}
                                {uploadResult.errors && uploadResult.errors.length > 0 && (
                                    <div className="card mb-3 border-danger">
                                        <div className="card-header border-danger">
                                            <details>
                                                <summary className="fw-bold text-danger" style={{ cursor: 'pointer', listStyle: 'none' }}>
                                                    <i className="fas fa-chevron-right me-2" style={{ fontSize: '0.8em' }}></i>
                                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                                    Pedidos No Creados ({uploadResult.errors.length})
                                                </summary>
                                                <div className="mt-3">
                                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                        <table className="table table-sm table-hover mb-0">
                                                            <thead className="table-light sticky-top">
                                                                <tr>
                                                                    <th style={{ width: '60px' }}>Índice</th>
                                                                    <th style={{ width: '80px' }}>User ID</th>
                                                                    <th>Producto</th>
                                                                    <th style={{ width: '100px' }}>Cantidad</th>
                                                                    <th>Motivo del Error</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {uploadResult.errors.map((err, idx) => (
                                                                    <tr key={idx} className="table-danger table-danger-subtle">
                                                                        <td>
                                                                            <span className="badge bg-secondary">{err.index + 1}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-secondary">{err.data?.user_id || 'N/A'}</span>
                                                                        </td>
                                                                        <td>
                                                                            <i className="fas fa-box-open text-danger me-2"></i>
                                                                            {err.data?.product_name || 'N/A'}
                                                                        </td>
                                                                        <td>
                                                                            <i className="fas fa-hashtag text-muted me-1"></i>
                                                                            {err.data?.amount || 'N/A'}
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="fas fa-exclamation-circle text-danger me-2"></i>
                                                                                <small className="text-danger">
                                                                                    <strong>{err.error}</strong>
                                                                                </small>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={downloadTemplate}
                            disabled={isUploading}
                        >
                            <i className="fas fa-download me-2"></i>
                            Descargar Plantilla
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={isUploading}
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleUpload}
                            disabled={!preview || preview.length === 0 || isUploading || disabled}
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cloud-upload-alt me-2"></i>
                                    Cargar Pedidos
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
