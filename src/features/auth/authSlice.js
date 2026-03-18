import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/login', credentials)
    localStorage.setItem('maasha_token', data.token)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed') }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/register', userData)
    localStorage.setItem('maasha_token', data.token)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed') }
})

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/auth/profile')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Session expired') }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('maasha_token') || null, loading: false, error: null, isAdmin: false },
  reducers: {
    logout(state) {
      state.user = null; state.token = null; state.isAdmin = false
      localStorage.removeItem('maasha_token')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isAdmin = a.payload.user?.role === 'admin' })
      .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isAdmin = a.payload.user?.role === 'admin' })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(loadUser.fulfilled, (s, a) => { s.user = a.payload; s.isAdmin = a.payload?.role === 'admin' })
      .addCase(loadUser.rejected,  (s) => { s.user = null; s.token = null; localStorage.removeItem('maasha_token') })
  },
})

export const { logout, clearError } = authSlice.actions
export const selectUser        = (s) => s.auth.user
export const selectIsAdmin     = (s) => s.auth.isAdmin
export const selectToken       = (s) => s.auth.token
export const selectAuthLoading = (s) => s.auth.loading
export const selectAuthError   = (s) => s.auth.error
export default authSlice.reducer
