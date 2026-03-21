import React, { useEffect, useState } from 'react'
import './Notifications.css';
import { api } from '../../utils/api';

export const Notifications = () => {
    // notifications state
    const [notifications, setNotifications] = useState([]);

    // function get notifications
    async function getUserNotifications() {
        try {
            const response = await api.get(`api/user/notifications`);
            console.log(response);
            setNotifications(response.data.notifications);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserNotifications();
    }, [])

    return (
        <div className='notifications-container'>
            
        </div>
    )
}
