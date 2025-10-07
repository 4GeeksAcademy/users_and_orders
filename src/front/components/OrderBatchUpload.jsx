import React, { useState, useRef } from "react";

export const OrderBatchUpload = ({ onBatchUpload }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/json") {
            setFile(selectedFile);
            setUploadResult(null);
        } else {
            alert("Por favor selecciona un archivo JSON válido");
            e.target.value = null;
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor selecciona un archivo JSON");
            return;
        }

        setIsUploading(true);
        setUploadResult(null);

        try {
            const fileContent = await file.text();
            const jsonData = JSON.parse(fileContent);

            // Validar que sea un array de pedidos
            if (!Array.isArray(jsonData)) {
                throw new Error("El archivo debe contener un array de pedidos");
            }

            // Validar estructura de cada pedido
            const validOrders = jsonData.every(
                (order) =>
                    order.hasOwnProperty("user_id") &&
                    order.hasOwnProperty("product_name") &&
                    order.hasOwnProperty("amount")
            );

            if (!validOrders) {
                throw new Error(
                    "Cada pedido debe tener: user_id, product_name, amount"
                );
            }

            // Llamar a la función de carga masiva
            const result = await onBatchUpload(jsonData);
            setUploadResult(result);

            // Limpiar el input file
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (error) {
            console.error("Error uploading orders:", error);
            alert(error.message || "Error al procesar el archivo");
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

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                    <i className="fas fa-upload me-2"></i>
                    Carga Masiva de Pedidos (JSON)
                </h5>
            </div>
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                accept=".json"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                disabled={isUploading}
                            />
                            <button
                                className="btn btn-info"
                                type="button"
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-cloud-upload-alt me-2"></i>
                                        Subir
                                    </>
                                )}
                            </button>
                        </div>
                        <small className="text-muted">
                            Formato: Array de objetos JSON con user_id, product_name, amount
                        </small>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <button
                            className="btn btn-outline-info"
                            onClick={downloadTemplate}
                            disabled={isUploading}
                        >
                            <i className="fas fa-download me-2"></i>
                            Descargar Plantilla
                        </button>
                    </div>
                </div>

                {uploadResult && (
                    <div className="mt-3">
                        <div
                            className={`alert ${uploadResult.created > 0 ? "alert-success" : "alert-warning"
                                }`}
                            role="alert"
                        >
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
                    </div>
                )}
            </div>
        </div>
    );
};
