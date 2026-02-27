import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://127.0.0.1:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
