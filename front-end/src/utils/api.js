import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// send token with every request by axios interceptors
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}), (error) => {
    return Promise.reject(error);
    };



// handle token expiration by axios response interceptors
api.interceptors.response.use((response) => {
    (error) => {
        if (error.response.status === 401) {
            // generate new access token
            const response = api.post('api/auth/generate-access-token');
            const { accessToken } = response.data;

            // set new token in local storage
            localStorage.setItem('token', accessToken);
        }
    }
    return response;
}), (error) => {
    return Promise.reject(error);
    };


