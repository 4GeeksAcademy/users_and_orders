import React from "react";
import "./Orders.css";

export const Orders = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">
                <i className="fas fa-shopping-cart me-2"></i>
                Gestión de Pedidos
              </h2>
            </div>
            <div className="card-body text-center py-5">
              <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">
                  <i className="fas fa-info-circle me-2"></i>
                  Página de Pedidos
                </h4>
                <p className="mb-0">
                  Aquí podrás crear, visualizar y gestionar todos los pedidos del sistema.
                </p>
                <hr />
                <p className="mb-0 text-muted">
                  Esta sección está lista para implementar el formulario de creación y la lista de pedidos asociados a usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
