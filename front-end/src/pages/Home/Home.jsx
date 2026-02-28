import React, { use, useState } from 'react'
import './Home.css'
import { Navbar } from '../../components/Navbar/Navbar'
import { api } from '../../utils/api';
import { useEffect } from 'react';

export const Home = () => {
    // posts state
    const [posts, setPosts] = useState([]);

    // get user profile picture
    const [profilePicture, setProfilePicture] = useState('');

    const [homeInfo, setHomeInfo] = useState({});

    useEffect(() => {
        async function fetchHomeInfo() {
            try {
                const response = await api.get('/api/user/');
                console.log(response);
                setHomeInfo(response.data);
                // setPosts(response.data.posts);
                setProfilePicture(response.data.profilePicture);
            } catch (error) {
                console.log(error);
            }
        }
        fetchHomeInfo();
    }, []);

    // fetch posts
    async function fetchPosts() {
        try {
            // get posts
            const posts = await api.get('/api/user/');
            console.log(posts);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Navbar profilePic={profilePicture}/>
            <img src={profilePicture} alt="profile" />
        </>
    )
}
