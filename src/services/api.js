import axios from 'axios';

/**
 * Global Axios API client configured for Equi-Extin.
 * Strictly enables withCredentials: true to send and receive HttpOnly JWT cookies (jwt_token).
 * Standardized to handle backend ErrorResponseDto structures.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8090/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // HttpOnly cookies are automatically attached by the browser
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend standardized ErrorResponseDto: { timestamp, status, error, message, path }
    const errorDto = error.response?.data;
    const status = error.response?.status;

    if (status === 401) {
      console.warn('[API 401] Session expired or unauthorized.');
      // Optional: Redirect to login or dispatch session expiration event
    } else if (status === 403) {
      console.warn('[API 403] Access denied: insufficient permissions.');
    } else if (status === 500) {
      console.error('[API 500] Internal server error:', errorDto?.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
