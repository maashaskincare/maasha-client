import api from './axios'

export const productAPI = {
  getAll:      (params)    => api.get('/api/products', { params }),
  getBySlug:   (slug)      => api.get(`/api/products/${slug}`),
  getFeatured: ()          => api.get('/api/products/featured'),
  getBestSellers: ()       => api.get('/api/products?bestSeller=true&limit=3'),
  search:      (q)         => api.get(`/api/products?search=${q}`),
  adminGetAll: (params)    => api.get('/api/admin/products', { params }),
  create:      (data)      => api.post('/api/admin/products', data),
  update:      (id, data)  => api.put(`/api/admin/products/${id}`, data),
  delete:      (id)        => api.delete(`/api/admin/products/${id}`),
}

export const categoryAPI = {
  getAll:  ()           => api.get('/api/categories'),
  create:  (data)       => api.post('/api/admin/categories', data),
  update:  (id, data)   => api.put(`/api/admin/categories/${id}`, data),
  delete:  (id)         => api.delete(`/api/admin/categories/${id}`),
}

export const orderAPI = {
  create:        (data)        => api.post('/api/orders', data),
  verifyPayment: (data)        => api.post('/api/orders/verify', data),
  getMyOrders:   ()            => api.get('/api/orders/my'),
  getById:       (id)          => api.get(`/api/orders/${id}`),
  adminGetAll:   (params)      => api.get('/api/admin/orders', { params }),
  updateStatus:  (id, status, note) => api.put(`/api/admin/orders/${id}/status`, { status, note }),
}

export const reviewAPI = {
  add:     (productId, data) => api.post(`/api/reviews/${productId}`, data),
  approve: (id)              => api.put(`/api/admin/reviews/${id}/approve`),
  reject:  (id)              => api.delete(`/api/admin/reviews/${id}`),
}

export const blogAPI = {
  getAll:      (params)   => api.get('/api/blogs', { params }),
  getBySlug:   (slug)     => api.get(`/api/blogs/${slug}`),
  getRecent:   ()         => api.get('/api/blogs?limit=3&sort=newest'),
  adminGetAll: (params)   => api.get('/api/admin/blogs', { params }),
  create:      (data)     => api.post('/api/admin/blogs', data),
  update:      (id, data) => api.put(`/api/admin/blogs/${id}`, data),
  delete:      (id)       => api.delete(`/api/admin/blogs/${id}`),
}

export const couponAPI = {
  validate: (code, orderTotal) => api.post('/api/coupons/validate', { code, orderTotal }),
  getAll:   ()           => api.get('/api/admin/coupons'),
  create:   (data)       => api.post('/api/admin/coupons', data),
  update:   (id, data)   => api.put(`/api/admin/coupons/${id}`, data),
  delete:   (id)         => api.delete(`/api/admin/coupons/${id}`),
}

export const bannerAPI = {
  getAll:  ()           => api.get('/api/banners'),
  create:  (data)       => api.post('/api/admin/banners', data),
  update:  (id, data)   => api.put(`/api/admin/banners/${id}`, data),
  delete:  (id)         => api.delete(`/api/admin/banners/${id}`),
}

export const adminAPI = {
  getStats:     ()       => api.get('/api/admin/stats'),
  getCustomers: (params) => api.get('/api/admin/customers', { params }),
  blockCustomer:(id)     => api.put(`/api/admin/customers/${id}/block`),
}

export const authAPI = {
  profile:        ()     => api.get('/api/auth/profile'),
  updateProfile:  (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
}

export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}
