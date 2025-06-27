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
                // Log and attach error message if token fetch fails
                console.error('Auth0 token error:', err?.message || err);
                // Optionally, you can throw or handle the error here
            }
            return config;
        },
        (error) => {
            console.error('Axios request error:', error?.message || error);
            return Promise.reject(error);
        }
    );
};

// Add response interceptors if needed
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log and return error with message
        const errorMsg = error?.response?.data?.message || error?.message || error;
        console.error('Axios response error:', errorMsg);
        return Promise.reject(errorMsg);
    }
);

export default authApi;
