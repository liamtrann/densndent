import axios from 'axios';

// Get the base URL based on environment
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use relative path since backend serves frontend
    return '/api';
  }
  // In development, use full URL
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptors if needed
api.interceptors.request.use(
  (config) => {
    // You can modify requests here (e.g., add auth tokens)
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptors if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default api;