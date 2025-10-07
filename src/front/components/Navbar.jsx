import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
	const location = useLocation();
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		console.log("Searching for:", searchTerm);
		// Aquí puedes implementar la lógica de búsqueda
	};

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
					<form className="d-flex" role="search" onSubmit={handleSearch}>
						<input
							className="form-control me-2"
							type="search"
							placeholder="Search"
							aria-label="Search"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button className="btn btn-outline-success" type="submit">Search</button>
					</form>
				</div>
				<div className="w-100 border-bottom"></div>
			</div>
		</nav>
	);
};