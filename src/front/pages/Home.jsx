import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "./Home.css";

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
				// Obtener datos de usuarios y pedidos
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
				console.error("Error loading stats:", error);
				setStats((prev) => ({ ...prev, loading: false }));
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="home-container">
			<div className="home-header">
				<h1>📊 Panel de Control</h1>
				<p className="home-subtitle">Gestión de Usuarios y Pedidos</p>
			</div>

			{stats.loading ? (
				<div className="loading-stats">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Cargando...</span>
					</div>
				</div>
			) : (
				<div className="stats-grid">
					<div className="stat-card stat-users" onClick={() => navigate('/users')}>
						<div className="stat-icon">👥</div>
						<div className="stat-info">
							<h3 className="stat-number">{stats.totalUsers}</h3>
							<p className="stat-label">Usuarios</p>
						</div>
					</div>

					<div className="stat-card stat-orders" onClick={() => navigate('/orders')}>
						<div className="stat-icon">📦</div>
						<div className="stat-info">
							<h3 className="stat-number">{stats.totalOrders}</h3>
							<p className="stat-label">Pedidos</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};