import React from 'react'
import './CreatePost.css';
import { useRef } from 'react';
import { Inputs } from '../../components/Inputs/Inputs';
import { api } from '../../utils/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from "react-bootstrap/Spinner";
import toast from 'react-hot-toast';

export const CreatePost = () => {
    // post ref
    const postRef = useRef();
    const captionRef = useRef();

    const navigate = useNavigate();

    // error state
    const [errorMessage, setErrorMessage] = useState('');

    // loading state
    const [loading, setLoading] = useState(false);

    // submit function
    async function createPost(ev) {
        ev.preventDefault();
        setErrorMessage('');

        const files = postRef.current.files;

        // handling error if the user did not sent the data
        if (files.length === 0) {
            setErrorMessage('you must choose at least one file');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            Array.from(files).forEach(file => {
                formData.append('images', file);
            });

            formData.append("caption", captionRef.current?.value || "");

            const response = await api.post('/api/post/create-post', formData);
            console.log(response);

            // navigate to home page
            navigate('/');
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'internal server error');
            setErrorMessage(error.response?.data?.message || 'unexpected error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='create-post-container'>
            <form onSubmit={createPost}>
                <Inputs
                    type='file'
                    id='post'
                    name='post'
                    multiple={true}
                    inputRef={postRef}
                    errorMessage={errorMessage}
                />

                {/* caption input */}
                <textarea
                    name="caption"
                    ref={captionRef}
                    id="caption">
                </textarea>

                {/* submit button */}
                <button type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Create'}
                </button>
            </form>
        </div>
    )
}



