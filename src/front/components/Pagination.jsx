import React from "react";

/**
 * Componente de paginación reutilizable
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {Function} onPageChange - Función a ejecutar al cambiar de página
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            // Mostrar solo algunas páginas alrededor de la actual
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 2 && i <= currentPage + 2)
            ) {
                pages.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? 'active' : ''}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(i)}
                        >
                            {i}
                        </button>
                    </li>
                );
            } else if (
                i === currentPage - 3 ||
                i === currentPage + 3
            ) {
                pages.push(
                    <li key={i} className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }
        }

        return pages;
    };

    return (
        <nav aria-label="Paginación">
            <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                </li>

                {renderPageNumbers()}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};
