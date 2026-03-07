import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
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
api.interceptors.response.use(
    (response) => {

        return response;
    }, async (error) => {
        try {

            if (error.response.data.message === 'refresh token is missing') {
                // logout user
                localStorage.removeItem('token');
                await api.post('api/auth/logout');
                // redirect to login page
                window.location.href = '/login';
            } else if (error.response.data.message === 'Invalid or expired token') {
                // generate new access token
                const response = await api.post('api/auth/generate-access-token');
                const { accessToken } = response.data;
                // store new access token in local storage
                localStorage.setItem('token', accessToken);
                // retry original request with new access token
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return api.request(error.config);
            }
        } catch (error) {
            return Promise.reject(error);
        }

    }
);













// import React, { useState } from "react";
// import { api } from "../../utils/api";
// import "./CreatePost.css";
// import { useNavigate } from "react-router-dom";

// export const CreatePost = () => {
//     const [files, setFiles] = useState([]);
//     const [caption, setCaption] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     function handleFileChange(e) {
//         setFiles(Array.from(e.target.files));
//         setError("");
//     }

//     async function handleSubmit(e) {
//         e.preventDefault();
//         if (files.length === 0) {
//             setError("Please select at least one file");
//             return;
//         }
//         setLoading(true);
//         const formData = new FormData();
//         files.forEach((file) => formData.append("images", file));
//         formData.append("caption", caption);

//         try {
//             const res = await api.post("/api/post/create-post", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             console.log("created post", res.data);
//             navigate("/");
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.message || "Failed to create post");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="create-post-container">
//             <h2>Create New Post</h2>
//             <form onSubmit={handleSubmit} className="create-post-form">
//                 <label htmlFor="images">Select images/videos</label>
//                 <input
//                     type="file"
//                     id="images"
//                     accept="image/*,video/*"
//                     multiple
//                     onChange={handleFileChange}
//                 />

//                 <label htmlFor="caption">Caption</label>
//                 <textarea
//                     id="caption"
//                     rows="3"
//                     value={caption}
//                     onChange={(e) => setCaption(e.target.value)}
//                 />

//                 {error && <p className="error-text">{error}</p>}

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="submit-btn"
//                 >
//                     {loading ? "Posting..." : "Post"}
//                 </button>
//             </form>
//         </div>
//     );
// };



