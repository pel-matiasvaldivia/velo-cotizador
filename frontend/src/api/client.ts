import axios from 'axios';

// Same-origin: nginx (prod) and Vite dev-proxy both forward /api to the backend.
export const api = axios.create({ baseURL: '/api' });

const TOKEN_KEY = 'velo_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Attach the bearer token on every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, drop the session and bounce to login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);
