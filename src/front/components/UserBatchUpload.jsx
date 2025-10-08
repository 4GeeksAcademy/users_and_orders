import React, { useState, useRef } from "react";
import { faker } from '@faker-js/faker';

/**
 * Componente para carga masiva de usuarios desde archivo JSON con Modal
 * @param {boolean} show - Controla si el modal está visible
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onUploadSuccess - Función a ejecutar cuando la carga sea exitosa
 * @param {boolean} disabled - Deshabilitar el componente
 */
export const UserBatchUpload = ({ show, onClose, onUploadSuccess, disabled = false }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  // Validar formato del JSON
  const validateUsers = (users) => {
    if (!Array.isArray(users)) {
      throw new Error("El JSON debe contener un array de usuarios");
    }

    if (users.length === 0) {
      throw new Error("El array de usuarios está vacío");
    }

    if (users.length > 1000) {
      throw new Error("Máximo 1000 usuarios por carga");
    }

    // Validar estructura de cada usuario
    users.forEach((user, index) => {
      if (!user.name || typeof user.name !== 'string') {
        throw new Error(`Usuario en índice ${index}: 'name' es requerido y debe ser texto`);
      }
      if (!user.email || typeof user.email !== 'string') {
        throw new Error(`Usuario en índice ${index}: 'email' es requerido y debe ser texto`);
      }
    });

    return true;
  };

  // Manejar selección de archivo
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
    setResult(null);

    // Leer y previsualizar el archivo
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        // Validar estructura
        let users;
        if (Array.isArray(json)) {
          users = json;
        } else if (json.users && Array.isArray(json.users)) {
          users = json.users;
        } else {
          throw new Error("El JSON debe contener un array de usuarios o un objeto con propiedad 'users'");
        }

        validateUsers(users);
        setPreview(users);
      } catch (err) {
        setError(`Error al leer el archivo: ${err.message}`);
        setFile(null);
        setPreview(null);
      }
    };
    reader.readAsText(selectedFile);
  };

  // Manejar carga del archivo
  const handleUpload = async () => {
    if (!preview || preview.length === 0) {
      setError("No hay usuarios para cargar");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await onUploadSuccess({ users: preview });
      setResult(response);

      // Limpiar formulario si fue exitoso
      if (response.created > 0) {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      setError(`Error al cargar usuarios: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar selección
  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cerrar modal y limpiar
  const handleCloseModal = () => {
    handleClear();
    onClose();
  };

  // Descargar plantilla JSON de ejemplo
  const handleDownloadTemplate = () => {
    const template = {
      users: [
        {
          name: "Usuario Ejemplo 1",
          email: "usuario1@ejemplo.com"
        },
        {
          name: "Usuario Ejemplo 2",
          email: "usuario2@ejemplo.com"
        },
        {
          name: "Usuario Ejemplo 3",
          email: "usuario3@ejemplo.com"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_usuarios.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generar datos dummy con Faker
  const handleGenerateDummyData = (count = 10) => {
    try {
      // Generar usuarios con datos realistas usando Faker
      const dummyUsers = Array.from({ length: count }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase()
      }));

      // Validar los datos generados
      validateUsers(dummyUsers);
      
      // Establecer el preview con los datos generados
      setPreview(dummyUsers);
      setError(null);
      setResult(null);
      
      // Crear un "archivo virtual" para mantener consistencia
      setFile({ name: `usuarios_dummy_${count}.json`, type: 'application/json' });
      
    } catch (err) {
      setError(`Error al generar datos dummy: ${err.message}`);
    }
  };

  return (
    <>
      {/* Backdrop del modal */}
      <div
        className={`modal fade ${show ? 'show' : ''}`}
        style={{ display: show ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!show}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content">
            {/* Header del Modal */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-file-import me-2"></i>
                Carga Masiva de Usuarios
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
                disabled={loading}
                aria-label="Close"
              ></button>
            </div>

            {/* Body del Modal */}
            <div className="modal-body">
              <div className="user-batch-upload">
                {/* Instrucciones */}
                <div className="alert alert-info">
                  <h6 className="alert-heading">
                    <i className="fas fa-info-circle me-2"></i>
                    Instrucciones
                  </h6>
                  <ul className="mb-0 small">
                    <li>El archivo debe ser formato JSON</li>
                    <li>Debe contener un array de usuarios</li>
                    <li>Cada usuario debe tener: <code>name</code> (texto), <code>email</code> (texto válido)</li>
                    <li>Máximo 1000 usuarios por carga</li>
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
                      Genera usuarios de prueba con datos realistas usando la librería Faker.
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleGenerateDummyData(5)}
                        disabled={loading || disabled}
                      >
                        <i className="fas fa-users me-1"></i>
                        Generar 5
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleGenerateDummyData(10)}
                        disabled={loading || disabled}
                      >
                        <i className="fas fa-users me-1"></i>
                        Generar 10
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleGenerateDummyData(25)}
                        disabled={loading || disabled}
                      >
                        <i className="fas fa-users me-1"></i>
                        Generar 25
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleGenerateDummyData(50)}
                        disabled={loading || disabled}
                      >
                        <i className="fas fa-users me-1"></i>
                        Generar 50
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleGenerateDummyData(100)}
                        disabled={loading || disabled}
                      >
                        <i className="fas fa-users me-1"></i>
                        Generar 100
                      </button>
                    </div>
                  </div>
                </div>

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
                    disabled={loading || disabled}
                  />
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

                {/* Resultados de la carga */}
                {result && (
                  <div className="batch-result-container">
                    {/* Resumen General */}
                    <div className={`alert ${result.created > 0 ? 'alert-success' : 'alert-warning'} mb-3`} role="alert">
                      <h6 className="alert-heading mb-3">
                        <i className={`fas ${result.created > 0 ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                        Resumen de la Carga
                      </h6>
                      <div className="row text-center">
                        <div className="col-4">
                          <div className="border rounded p-2 bg-light">
                            <h4 className="mb-0">{result.total_processed}</h4>
                            <small className="text-muted">Total Procesados</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="border rounded p-2 bg-success bg-opacity-10">
                            <h4 className="mb-0 text-success">{result.created}</h4>
                            <small className="text-success">Exitosos</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="border rounded p-2 bg-danger bg-opacity-10">
                            <h4 className="mb-0 text-danger">{result.failed}</h4>
                            <small className="text-danger">Fallidos</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Usuarios Creados Exitosamente */}
                    {result.users && result.users.length > 0 && (
                      <div className="card mb-3 border-success">
                        <div className="card-header bg-success bg-opacity-10 border-success">
                          <details>
                            <summary className="fw-bold text-success" style={{ cursor: 'pointer', listStyle: 'none' }}>
                              <i className="fas fa-chevron-right me-2" style={{ fontSize: '0.8em' }}></i>
                              <i className="fas fa-check-circle me-2"></i>
                              Usuarios Creados Exitosamente ({result.users.length})
                            </summary>
                            <div className="mt-3">
                              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table className="table table-sm table-hover mb-0">
                                  <thead className="table-light sticky-top">
                                    <tr>
                                      <th style={{ width: '60px' }}>ID</th>
                                      <th>Nombre</th>
                                      <th>Email</th>
                                      <th style={{ width: '120px' }}>Estado</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.users.map((user, idx) => (
                                      <tr key={user.id || idx}>
                                        <td>
                                          <span className="badge bg-primary">{user.id}</span>
                                        </td>
                                        <td>
                                          <i className="fas fa-user text-success me-2"></i>
                                          {user.name}
                                        </td>
                                        <td>
                                          <i className="fas fa-envelope text-muted me-2"></i>
                                          <small>{user.email}</small>
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

                    {/* Lista de Usuarios Fallidos */}
                    {result.errors && result.errors.length > 0 && (
                      <div className="card mb-3 border-danger">
                        <div className="card-header bg-danger bg-opacity-10 border-danger">
                          <details>
                            <summary className="fw-bold text-danger" style={{ cursor: 'pointer', listStyle: 'none' }}>
                              <i className="fas fa-chevron-right me-2" style={{ fontSize: '0.8em' }}></i>
                              <i className="fas fa-exclamation-triangle me-2"></i>
                              Usuarios No Creados ({result.errors.length})
                            </summary>
                            <div className="mt-3">
                              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table className="table table-sm table-hover mb-0">
                                  <thead className="table-light sticky-top">
                                    <tr>
                                      <th style={{ width: '60px' }}>Índice</th>
                                      <th>Nombre</th>
                                      <th>Email</th>
                                      <th>Motivo del Error</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.errors.map((err, idx) => (
                                      <tr key={idx} className="table-danger table-danger-subtle">
                                        <td>
                                          <span className="badge bg-secondary">{err.index + 1}</span>
                                        </td>
                                        <td>
                                          <i className="fas fa-user-times text-danger me-2"></i>
                                          {err.data?.name || 'N/A'}
                                        </td>
                                        <td>
                                          <i className="fas fa-envelope text-muted me-2"></i>
                                          <small>{err.data?.email || 'N/A'}</small>
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

                {/* Preview de usuarios */}
                {preview && preview.length > 0 && !result && (
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-eye me-2"></i>
                        Preview: {preview.length} usuario(s) a cargar
                      </h6>
                    </div>
                    <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <table className="table table-sm table-hover mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.slice(0, 10).map((user, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                            </tr>
                          ))}
                          {preview.length > 10 && (
                            <tr>
                              <td colSpan="3" className="text-center text-muted">
                                ... y {preview.length - 10} más
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleDownloadTemplate}
                disabled={loading}
              >
                <i className="fas fa-download me-2"></i>
                Descargar Plantilla
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!preview || preview.length === 0 || loading || disabled}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Cargar Usuarios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop oscuro */}
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};
