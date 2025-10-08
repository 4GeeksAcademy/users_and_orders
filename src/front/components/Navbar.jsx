import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearch } from "../contexts/SearchContext";
import "./Navbar.css";

export const Navbar = () => {
	const location = useLocation();
	const { searchTerm, handleSearch: onSearch, handleClear: onClearSearch } = useSearch();
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	// Sincronizar con el searchTerm externo cuando cambie
	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	// Limpiar búsqueda al cambiar de página
	useEffect(() => {
		setLocalSearchTerm("");
		onClearSearch();
	}, [location.pathname]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (localSearchTerm.trim()) {
			onSearch(localSearchTerm.trim());
		}
	};

	const handleClear = () => {
		setLocalSearchTerm("");
		onClearSearch();
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setLocalSearchTerm(value);
		// Si el campo se vacía, limpiar la búsqueda
		if (value === "") {
			onClearSearch();
		}
	};

	// Determinar el placeholder según la ruta actual
	const getPlaceholder = () => {
		if (location.pathname === "/users") {
			return "Buscar por nombre o email...";
		} else if (location.pathname === "/orders") {
			return "Buscar por producto...";
		}
		return "Buscar...";
	};

	// Mostrar barra de búsqueda solo en Users y Orders
	const showSearch = location.pathname === "/users" || location.pathname === "/orders";

	return (
		<nav className="navbar navbar-light bg-body-tertiary">
			<div className="container-fluid d-flex flex-column p-0">
				<div className="d-flex justify-content-between align-items-center w-100 px-3 py-2">
					<ul className="nav nav-tabs border-0 mb-0">
						<li className="nav-item">
							<Link
								className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
								aria-current={location.pathname === "/" ? "page" : undefined}
								to="/"
							>
								Home
							</Link>
						</li>
						<li className="nav-item">
							<Link
								className={`nav-link ${location.pathname === "/users" ? "active" : ""}`}
								to="/users"
							>
								Users
							</Link>
						</li>
						<li className="nav-item">
							<Link
								className={`nav-link ${location.pathname === "/orders" ? "active" : ""}`}
								to="/orders"
							>
								Orders
							</Link>
						</li>
					</ul>
					{showSearch && (
						<form className="d-flex" role="search" onSubmit={handleSubmit}>
							<div className="input-group">
								<input
									className="form-control"
									type="search"
									placeholder={getPlaceholder()}
									aria-label="Search"
									value={localSearchTerm}
									onChange={handleInputChange}
								/>
								{localSearchTerm && (
									<button
										className="btn btn-outline-secondary"
										type="button"
										onClick={handleClear}
										title="Limpiar búsqueda"
									>
										×
									</button>
								)}
								<button className="btn btn-outline-success" type="submit">
									Buscar
								</button>
							</div>
						</form>
					)}
				</div>
				<div className="w-100 border-bottom"></div>
			</div>
		</nav>
	);
};