import api from './axios'

export const productAPI = {
  // Public
  getAll:       (params)   => api.get('/api/products', { params }),
  getBySlug:    (slug)     => api.get(`/api/products/${slug}`),
  getFeatured:  ()         => api.get('/api/products/featured'),
  getBestSellers: ()       => api.get('/api/products/bestsellers'),
  search:       (q)        => api.get(`/api/products?search=${q}`),
  // Admin
  adminGetAll:  (params)   => api.get('/api/products/admin/all', { params }),
  create:       (data)     => api.post('/api/products', data),
  update:       (id, data) => api.put(`/api/products/${id}`, data),
  delete:       (id)       => api.delete(`/api/products/${id}`),
}

export const categoryAPI = {
  getAll:  ()            => api.get('/api/categories'),
  create:  (data)        => api.post('/api/categories', data),
  update:  (id, data)    => api.put(`/api/categories/${id}`, data),
  delete:  (id)          => api.delete(`/api/categories/${id}`),
}

export const orderAPI = {
  // User
  create:        (data)   => api.post('/api/orders', data),
  verifyPayment: (data)   => api.post('/api/orders/verify-payment', data),
  getMyOrders:   ()       => api.get('/api/orders/my-orders'),
  getById:       (id)     => api.get(`/api/orders/${id}`),
  // Admin
  adminGetAll:   (params) => api.get('/api/orders/admin/all', { params }),
  getStats:      ()       => api.get('/api/orders/admin/stats'),
  updateStatus:  (id, status, note) => api.put(`/api/orders/${id}/status`, { status, note }),
}

export const reviewAPI = {
  add:     (productId, data) => api.post('/api/reviews', { ...data, productId }),
  getByProduct: (productId)  => api.get(`/api/reviews/product/${productId}`),
  adminGetAll:  ()           => api.get('/api/reviews/admin/all'),
  approve: (id)              => api.put(`/api/reviews/${id}/approve`),
}

export const blogAPI = {
  // Public
  getAll:      (params)   => api.get('/api/blogs', { params }),
  getBySlug:   (slug)     => api.get(`/api/blogs/${slug}`),
  getRecent:   ()         => api.get('/api/blogs?limit=3&sort=newest'),
  // Admin
  adminGetAll: (params)   => api.get('/api/blogs/admin/all', { params }),
  create:      (data)     => api.post('/api/blogs', data),
  update:      (id, data) => api.put(`/api/blogs/${id}`, data),
  delete:      (id)       => api.delete(`/api/blogs/${id}`),
}

export const couponAPI = {
  validate: (code, orderTotal) => api.post('/api/coupons/validate', { code, orderTotal }),
  getAll:   ()           => api.get('/api/coupons'),
  create:   (data)       => api.post('/api/coupons', data),
  delete:   (id)         => api.delete(`/api/coupons/${id}`),
}

export const bannerAPI = {
  getAll:  ()            => api.get('/api/banners'),
  create:  (data)        => api.post('/api/banners', data),
  update:  (id, data)    => api.put(`/api/banners/${id}`, data),
  delete:  (id)          => api.delete(`/api/banners/${id}`),
}

export const adminAPI = {
  getStats:     ()       => api.get('/api/orders/admin/stats'),
  getCustomers: (params) => api.get('/api/admin/customers', { params }),
  blockCustomer:(id)     => api.put(`/api/admin/customers/${id}/block`),
}

export const authAPI = {
  profile:        ()     => api.get('/api/auth/profile'),
  updateProfile:  (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
}

export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMultiple: (formData) => api.post('/api/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}
