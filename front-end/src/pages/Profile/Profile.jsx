import React, { useEffect } from 'react'
import './Profile.css'
import { useParams } from 'react-router-dom'
import { api } from '../../utils/api';

export const Profile = () => {
    // user id
    const { id } = useParams();

    // fecth user data
    async function getProfile() {
        try {
            const userData = await api.get(`api/user/${id}/profile`);
            console.log(userData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProfile();
    }, [id]);

    return (
        <div>
            
        </div>
    )
}
