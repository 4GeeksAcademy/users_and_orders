import { useState, useEffect } from "react";
import apiService from "../services/apiService";

/**
 * Hook personalizado para gestión de usuarios
 * Maneja estado, paginación, búsqueda y operaciones CRUD de usuarios
 */
export const useUsers = (initialPage = 1, perPage = 10) => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    per_page: perPage,
    total: 0,
    total_pages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Obtiene usuarios con paginación y búsqueda
   */
  const fetchUsers = async (page = 1, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      const params = { page, per_page: perPage };
      if (search) params.search = search;

      const response = await apiService.users.getAll(params);

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

  /**
   * Crea un nuevo usuario
   */
  const createUser = async (userData) => {
    try {
      const newUser = await apiService.users.create({
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
      });

      await fetchUsers(pagination.page);
      return { success: true, user: newUser };
    } catch (err) {
      console.error("Error creating user:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Actualiza un usuario existente
   */
  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await apiService.users.update(userId, userData);
      await fetchUsers(pagination.page);
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error("Error updating user:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Elimina un usuario (solo si no tiene pedidos)
   */
  const deleteUser = async (userId) => {
    try {
      await apiService.users.delete(userId);
      await fetchUsers(pagination.page);
      return { success: true };
    } catch (err) {
      console.error("Error deleting user:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Cambia a una página específica
   */
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  /**
   * Busca usuarios por nombre o email
   */
  const searchUsers = (search) => {
    setSearchTerm(search);
    fetchUsers(1, search);
  };

  /**
   * Limpia el término de búsqueda
   */
  const clearSearch = () => {
    setSearchTerm("");
    fetchUsers(1, "");
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
    searchTerm,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    changePage,
    searchUsers,
    clearSearch,
    setError,
  };
};

export default useUsers;
