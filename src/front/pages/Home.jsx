import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "./Home.css";

/**
 * Componente Home - Dashboard principal de la aplicación
 * Muestra estadísticas generales y permite navegación rápida a las secciones principales
 */
export const Home = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalOrders: 0,
		loading: true,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				// Peticiones paralelas para optimizar el tiempo de carga
				// Solo obtenemos la primera página para extraer el total de registros
				const [usersResponse, ordersResponse] = await Promise.all([
					apiService.users.getAll({ page: 1, per_page: 1 }),
					apiService.orders.getAll({ page: 1, per_page: 1 }),
				]);

				setStats({
					totalUsers: usersResponse.total || 0,
					totalOrders: ordersResponse.total || 0,
					loading: false,
				});
			} catch (error) {
				console.error("Error al cargar estadísticas:", error);
				// Mantenemos loading en false para mostrar el dashboard con valores en 0
				setStats((prev) => ({ ...prev, loading: false }));
			}
		};

		fetchStats();
	}, []);

	const handleNavigateToUsers = () => navigate('/users');
	const handleNavigateToOrders = () => navigate('/orders');

	if (stats.loading) {
		return (
			<div className="home-container">
				<div className="loading-stats">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Cargando...</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="home-container">
			<header className="home-header">
				<h1>📊 Panel de Control</h1>
				<p className="home-subtitle">Gestión de Usuarios y Pedidos</p>
			</header>

			<div className="stats-grid">
				<article
					className="stat-card stat-users"
					onClick={handleNavigateToUsers}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => e.key === 'Enter' && handleNavigateToUsers()}
					aria-label={`Ver ${stats.totalUsers} usuarios`}
				>
					<div className="stat-icon" aria-hidden="true">👥</div>
					<div className="stat-info">
						<h3 className="stat-number">{stats.totalUsers}</h3>
						<p className="stat-label">Usuarios</p>
					</div>
				</article>

				<article
					className="stat-card stat-orders"
					onClick={handleNavigateToOrders}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => e.key === 'Enter' && handleNavigateToOrders()}
					aria-label={`Ver ${stats.totalOrders} pedidos`}
				>
					<div className="stat-icon" aria-hidden="true">📦</div>
					<div className="stat-info">
						<h3 className="stat-number">{stats.totalOrders}</h3>
						<p className="stat-label">Pedidos</p>
					</div>
				</article>
			</div>
		</div>
	);
};