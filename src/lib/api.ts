import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Helper function to get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Set auth token (called after successful login/register)
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  console.log('✅ Auth token saved to localStorage');
};

/**
 * Clear auth token (called on logout)
 */
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  console.log('✅ Auth token cleared from localStorage');
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [AXIOS] Attaching token to request:', config.method, config.url);
    } else {
      console.log('⚠️ [AXIOS] No auth token found for request:', config.method, config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ [AXIOS] Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('❌ [AXIOS] Response error:', error.response?.status, error.response?.data);
      if (error.response?.status === 401) {
        console.warn('⚠️ [AXIOS] Unauthorized response received');
      }
    } else {
      console.error('❌ [AXIOS] Unknown response error:', error);
    }
    return Promise.reject(error);
  }
);

const handleResponse = (response: any) => response.data;

const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'Request failed';
    throw new Error(message);
  }
  throw error;
};

export const get = async (endpoint: string) => {
  try {
    return handleResponse(await apiClient.get(endpoint));
  } catch (error) {
    handleError(error);
  }
};

export const post = async (endpoint: string, body: any) => {
  try {
    return handleResponse(await apiClient.post(endpoint, body));
  } catch (error) {
    handleError(error);
  }
};

export const put = async (endpoint: string, body: any) => {
  try {
    return handleResponse(await apiClient.put(endpoint, body));
  } catch (error) {
    handleError(error);
  }
};

export const del = async (endpoint: string) => {
  try {
    return handleResponse(await apiClient.delete(endpoint));
  } catch (error) {
    handleError(error);
  }
};

/**
 * Auth API endpoints
 */
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    post('/auth/login', data),

  getCurrentUser: () =>
    get('/auth/me'),

  logout: () =>
    post('/auth/logout', {}),

  updateProfile: (data: any) =>
    put('/auth/me', data),
};

/**
 * Rental API endpoints
 */
export const rentalAPI = {
  getAll: () =>
    get('/rentals'),

  getMyRentals: () =>
    get('/rentals/my-rentals/list'),

  getById: (id: string) =>
    get(`/rentals/${id}`),

  create: (data: any) =>
    post('/rentals', data),

  update: (id: string, data: any) =>
    put(`/rentals/${id}`, data),

  delete: (id: string) =>
    del(`/rentals/${id}`),
};

/**
 * Booking API endpoints
 */
export const bookingAPI = {
  getAll: () =>
    get('/bookings/my-bookings/list'),

  getById: (id: string) =>
    get(`/bookings/${id}`),

  create: (data: any) =>
    post('/bookings', data),

  update: (id: string, data: any) =>
    put(`/bookings/${id}`, data),

  delete: (id: string) =>
    del(`/bookings/${id}`),
};
