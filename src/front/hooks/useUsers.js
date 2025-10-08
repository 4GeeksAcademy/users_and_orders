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
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener usuarios
  const fetchUsers = async (page = 1, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page,
        per_page: perPage,
      };

      if (search) {
        params.search = search;
      }

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

  // Función para actualizar un usuario
  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await apiService.users.update(userId, userData);

      // Recargar la lista después de actualizar
      await fetchUsers(pagination.page);

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error("Error updating user:", err);
      return { success: false, error: err.message };
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (userId) => {
    try {
      await apiService.users.delete(userId);

      // Recargar la lista después de eliminar
      await fetchUsers(pagination.page);

      return { success: true };
    } catch (err) {
      console.error("Error deleting user:", err);
      return { success: false, error: err.message };
    }
  };

  // Cambiar página
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  // Función para buscar usuarios
  const searchUsers = (search) => {
    setSearchTerm(search);
    fetchUsers(1, search); // Volver a página 1 con nueva búsqueda
  };

  // Limpiar búsqueda
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
