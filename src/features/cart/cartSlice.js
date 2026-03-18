import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
  try { const s = localStorage.getItem('maasha_cart'); return s ? JSON.parse(s) : [] }
  catch { return [] }
}
const saveCart = (items) => {
  try { localStorage.setItem('maasha_cart', JSON.stringify(items)) } catch {}
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart(), coupon: null, discount: 0 },
  reducers: {
    addToCart(state, action) {
      const { product, qty = 1 } = action.payload
      const existing = state.items.find(i => i._id === product._id)
      if (existing) { existing.qty = Math.min(existing.qty + qty, 10) }
      else { state.items.push({ ...product, qty }) }
      saveCart(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i._id !== action.payload)
      saveCart(state.items)
    },
    updateQty(state, action) {
      const { id, qty } = action.payload
      const item = state.items.find(i => i._id === id)
      if (item) { item.qty = Math.max(1, Math.min(qty, 10)) }
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []; state.coupon = null; state.discount = 0; saveCart([])
    },
    applyCoupon(state, action) {
      state.coupon = action.payload.code; state.discount = action.payload.discount
    },
    removeCoupon(state) { state.coupon = null; state.discount = 0 },
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart, applyCoupon, removeCoupon } = cartSlice.actions
export const selectCartItems    = (s) => s.cart.items
export const selectCartCount    = (s) => s.cart.items.reduce((t, i) => t + i.qty, 0)
export const selectCartSubtotal = (s) => s.cart.items.reduce((t, i) => t + i.price * i.qty, 0)
export const selectCartDiscount = (s) => s.cart.discount
export const selectCoupon       = (s) => s.cart.coupon
export default cartSlice.reducer
