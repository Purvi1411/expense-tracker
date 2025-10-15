// client/src/utils/axiosInstance.js

import axios from 'axios';

// Create a custom instance of Axios
const axiosInstance = axios.create({
    baseURL: '/api', // All requests will start with /api (e.g., /api/transactions)
});

// Request Interceptor: Add the JWT token to the header before sending the request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            // Set the Authorization header with the Bearer token for protected routes
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (Optional but recommended for auto-logout)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the backend returns 401 (Unauthorized), force user logout
        if (error.response && error.response.status === 401) {
            // This is a simplified approach; in a real app, you'd use a dedicated context hook
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Force a page refresh or redirect to login
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;