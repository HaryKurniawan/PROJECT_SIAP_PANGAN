import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'spb-api-key-2026-s3cur3-k3y';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  withCredentials: true, // Penting: kirim cookie cross-origin
});

// Interceptor: handle 401 errors (cookie expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Redirect ke login jika di halaman admin
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
