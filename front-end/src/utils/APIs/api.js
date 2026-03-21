import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_LOCAL,
    withCredentials: true,
});

// send token with every request by axios interceptors
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
}, (error) => {
    return Promise.reject(error);
});



// handle token expiration by axios response interceptors
api.interceptors.response.use(
    (response) => {

        return response;
    }, async (error) => {
        try {
            console.log(error);

            if (error.response?.data?.message === 'no refresh token provided') {
                // logout user
                localStorage.removeItem('token');
                await api.post('api/auth/logout');
                // redirect to login page
                window.location.href = '/login';
                return Promise.reject(error);
            } else if (error.response?.status === 401) {
                // generate new access token
                const response = await api.post('api/auth/generate-access-token');
                const { accessToken } = response.data;
                // store new access token in local storage
                localStorage.setItem('token', accessToken);
                // retry original request with new access token
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return api.request(error.config);
            } else {
                // Return other errors
                return Promise.reject(error);
            }
        } catch (error) {
            return Promise.reject(error);
        }

    }
);

