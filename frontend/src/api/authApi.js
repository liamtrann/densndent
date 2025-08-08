import axios from 'axios';

const authApi = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Call this ONCE in your app (e.g., in App.js) to set up the interceptor
export const setupAuthApiInterceptors = (getAccessTokenSilently) => {
    authApi.interceptors.request.use(
        async (config) => {
            try {
                const token = await getAccessTokenSilently();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (err) {
                // Handle auth token error silently or redirect to login
                // console.error('Auth0 token error:', err?.message || err);
            }
            return config;
        },
        (error) => {
            // console.error('Axios request error:', error?.message || error);
            return Promise.reject(error);
        }
    );
};

// Add response interceptors if needed
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle error silently or with proper error handling
        const errorMsg = error?.response?.data?.message || error?.message || error;
        // console.error('Axios response error:', errorMsg);
        return Promise.reject(errorMsg);
    }
);

export default authApi;
