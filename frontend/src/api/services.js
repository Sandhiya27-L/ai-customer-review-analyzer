import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
  deleteAccount: () => api.delete('/profile'),
};

export const reviewApi = {
  analyze: (reviewText) => api.post('/reviews/analyze', { reviewText }),
};

export const historyApi = {
  save: (analysis) => api.post('/history', { analysis }),
  list: (params) => api.get('/history', { params }),
  get: (id) => api.get(`/history/${id}`),
  recent: (limit = 5) => api.get('/history/recent', { params: { limit } }),
  delete: (id) => api.delete(`/history/${id}`),
};

export const favoritesApi = {
  add: (analysisId) => api.post('/favorites', { analysisId }),
  list: () => api.get('/favorites'),
  remove: (id) => api.delete(`/favorites/${id}`),
};
