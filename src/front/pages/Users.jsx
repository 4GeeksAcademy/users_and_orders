import React from "react";
import "./Users.css";

export const Users = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Gestión de Usuarios
              </h2>
            </div>
            <div className="card-body text-center py-5">
              <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">
                  <i className="fas fa-info-circle me-2"></i>
                  Página de Usuarios
                </h4>
                <p className="mb-0">
                  Aquí podrás crear, visualizar y gestionar todos los usuarios del sistema.
                </p>
                <hr />
                <p className="mb-0 text-muted">
                  Esta sección está lista para implementar el formulario de creación y la lista de usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
