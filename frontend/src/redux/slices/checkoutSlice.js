import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Función asíncrona para crear sesiones de pago/checkout
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken"); // Corregí: "userToken" en comillas
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Manejo robusto de errores
      const errorData = {
        message: "Error al crear el checkout",
        details: error.message,
        status: error.response?.status,
      };
      
      if (error.response?.data) {
        return rejectWithValue({
          ...errorData,
          ...error.response.data,
        });
      }
      
      return rejectWithValue(errorData);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    checkoutId: localStorage.getItem("lastCheckoutId") || null,
  },
  reducers: {
    clearCheckoutError: (state) => {
      state.error = null;
    },
    clearCheckout: (state) => {
      state.checkout = null;
      state.error = null;
      state.checkoutId = null;
      localStorage.removeItem("lastCheckoutId");
    },
    setCheckoutId: (state, action) => {
      state.checkoutId = action.payload;
      localStorage.setItem("lastCheckoutId", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.error = null;
        
        // Guardar checkout ID si existe
        const checkoutId = action.payload?._id || action.payload?.checkout?._id || action.payload?.data?._id;
        if (checkoutId) {
          state.checkoutId = checkoutId;
          localStorage.setItem("lastCheckoutId", checkoutId);
        }
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        // Manejo seguro del error
        state.error = action.payload?.message 
          || action.error?.message 
          || "Error al crear el checkout";
      });
  },
});

export const { clearCheckoutError, clearCheckout, setCheckoutId } = checkoutSlice.actions;
export default checkoutSlice.reducer;