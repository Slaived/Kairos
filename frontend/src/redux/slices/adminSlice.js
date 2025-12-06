import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Obtener todos los usuarios (solo administrador)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("userToken")}` 
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

// Agregar la acción de crear usuario
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

// Actualizar la información del usuario
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, role }, { rejectWithValue }) => { // Solo necesitas id y role
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { role }, // Solo envías el role a cambiar
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

// Eliminar un usuario - ¡CORREGIDO!
export const deleteUser = createAsyncThunk(
  "admin/deleteUser", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, // Quita "/delete/"
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Respuesta del backend al borrar:", response.data); // Para debug
      return id; // Devuelve el ID del usuario borrado
    } catch (error) {
      console.error("Error al borrar usuario:", error.response); // Para debug
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Error al eliminar usuario"
      });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error al cargar usuarios";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Error al actualizar usuario";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        // Filtra el usuario eliminado por su ID
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Error al eliminar usuario";
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Agregar un nuevo usuario al estado
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error al agregar usuario";
      });
  },
});

export default adminSlice.reducer;