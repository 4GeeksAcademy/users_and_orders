import React, { useEffect, useState } from "react";
import apiService from "../services/apiService.js";

const Footer = () => {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadMessage = async () => {
			try {
				const data = await apiService.hello();
				setMessage(data.message);
			} catch (error) {
				setError(
					error.message ||
					"No se pudo obtener el mensaje del backend. Verifica que el backend esté corriendo y el puerto sea público."
				);
			} finally {
				setLoading(false);
			}
		};
		loadMessage();
	}, []);

	return (
		<footer className="footer mt-auto py-3 text-center">
			<p>
				Made with <i className="fa fa-heart text-danger" /> to{" "}
				<a href="http://www.4geeksacademy.com">4Geeks Academy</a>
			</p>
			<div className="alert alert-info mt-3">
				{loading ? (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				) : error ? (
					<span className="text-danger">{error}</span>
				) : (
					<span>{message}</span>
				)}
			</div>
		</footer>
	);
};

export { Footer };
