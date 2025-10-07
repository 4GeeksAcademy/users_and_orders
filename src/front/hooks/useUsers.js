import { useState, useEffect } from "react";
import apiService from "../services/apiService";

/**
 * Hook personalizado para gestionar el estado y operaciones de usuarios
 * @param {number} initialPage - Página inicial para la paginación
 * @param {number} perPage - Cantidad de usuarios por página
 */
export const useUsers = (initialPage = 1, perPage = 10) => {
  // Estados de la lista de usuarios
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    per_page: perPage,
    total: 0,
    total_pages: 0,
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener usuarios
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.users.getAll({
        page: page,
        per_page: perPage,
      });

      setUsers(response.users);
      setPagination({
        page: response.page,
        per_page: response.per_page,
        total: response.total,
        total_pages: response.total_pages,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Error al cargar usuarios: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo usuario
  const createUser = async (userData) => {
    try {
      const newUser = await apiService.users.create({
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
      });

      // Recargar la lista después de crear
      await fetchUsers(pagination.page);

      return { success: true, user: newUser };
    } catch (err) {
      console.error("Error creating user:", err);
      return { success: false, error: err.message };
    }
  };

  // Cambiar página
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchUsers(newPage);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers(initialPage);
  }, []);

  return {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    createUser,
    changePage,
    setError,
  };
};
