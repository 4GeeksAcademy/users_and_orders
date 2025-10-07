import React, { useState, useRef } from "react";

/**
 * Componente para carga masiva de pedidos desde archivo JSON con Modal
 * @param {boolean} show - Controla si el modal está visible
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onBatchUpload - Función a ejecutar cuando la carga sea exitosa
 * @param {boolean} disabled - Deshabilitar el componente
 */
export const OrderBatchUpload = ({ show, onClose, onBatchUpload, disabled = false }) => {
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
                            <div className={`alert ${uploadResult.created > 0 ? "alert-success" : "alert-warning"}`}>
                                <h6 className="alert-heading">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Resultado de la Carga
                                </h6>
                                <ul className="mb-0">
                                    <li>
                                        <strong>Total procesados:</strong> {uploadResult.total_processed}
                                    </li>
                                    <li>
                                        <strong>Creados exitosamente:</strong> {uploadResult.created}
                                    </li>
                                    {uploadResult.failed > 0 && (
                                        <li>
                                            <strong>Fallidos:</strong> {uploadResult.failed}
                                        </li>
                                    )}
                                </ul>

                                {uploadResult.errors && uploadResult.errors.length > 0 && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer">
                                            <i className="fas fa-chevron-right me-1"></i>
                                            Ver errores ({uploadResult.errors.length})
                                        </summary>
                                        <ul className="mt-2 mb-0">
                                            {uploadResult.errors.map((error, index) => (
                                                <li key={index}>
                                                    <small>
                                                        Índice {error.index}: {error.error}
                                                    </small>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
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
