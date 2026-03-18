import { configureStore } from '@reduxjs/toolkit'
import cartReducer    from '../features/cart/cartSlice'
import authReducer    from '../features/auth/authSlice'
import productReducer from '../features/product/productSlice'

export const store = configureStore({
  reducer: {
    cart:    cartReducer,
    auth:    authReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
