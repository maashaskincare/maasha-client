import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try { const { data } = await api.get('/api/products', { params }); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to load products') }
})

export const fetchFeaturedProducts = createAsyncThunk('product/fetchFeatured', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/api/products/featured'); return data }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [], featured: [], total: 0, page: 1, pages: 1, loading: false, error: null,
    filters: { category: '', skinType: '', minPrice: '', maxPrice: '', sort: 'newest', search: '' },
  },
  reducers: {
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload } },
    clearFilters(state) { state.filters = { category: '', skinType: '', minPrice: '', maxPrice: '', sort: 'newest', search: '' } },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (s) => { s.loading = true })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload.products || a.payload; s.total = a.payload.total || a.payload.length; s.pages = a.payload.pages || 1 })
      .addCase(fetchProducts.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchFeaturedProducts.fulfilled, (s, a) => { s.featured = a.payload.products || a.payload })
  },
})

export const { setFilters, clearFilters } = productSlice.actions
export const selectProducts       = (s) => s.product.products
export const selectFeatured       = (s) => s.product.featured
export const selectProductLoading = (s) => s.product.loading
export const selectFilters        = (s) => s.product.filters
export default productSlice.reducer
