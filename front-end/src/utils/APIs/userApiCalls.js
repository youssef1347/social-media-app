import { api } from "./api";


export const toggleFollow = async (id) => {
    try {
        const response = await api.put(`/api/user/follow/${id}`);
        console.log(response);
        
    } catch (error) {
        console.log(error);
    }
}

export const toggleBlock = async (id) => {
    try {
        const response = await api.put(`/api/user/block/${id}`);
            console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export const toggleCloseFriend = async (id) => {
    try {
        const response = await api.put(`/api/user/add-close-friends/${id}`);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/api/auth/logout');
        console.log(response);
        localStorage.removeItem('token');
    } catch (error) {
        console.log(error);
    }
}

export const getCloseFriends = async () => {
    try {
        const response = await api.get('/api/user/close-friends');
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}