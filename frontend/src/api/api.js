import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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