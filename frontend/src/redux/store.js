import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import productRudecer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import adminProductsReducer from './slices/adminProductSlice';
import adminOrdersReducer from './slices/adminOrderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productRudecer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductsReducer,
    adminOrders: adminOrdersReducer,    
  },
});

export default store;
