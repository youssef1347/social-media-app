import React, { useRef } from "react";
import "./CommentsWindow.css";
import { FaArrowUp } from "react-icons/fa";
import { api } from "../../utils/api";


export const CommentsWindow = ({ comments, onClose, post_id }) => {
    // comments ref
    const commentRef = useRef();

    // send comment function
    async function sendComment() {
        try {
            const commentText = commentRef.current.value;

            const commentRes = await api.post(`/api/comment/${post_id}/create-comment`, {commentText});
            console.log(commentRes);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="comments-window-backdrop">
            <div className="comments-window-container">
                <button className="close-btn" onClick={onClose}>
                X
                </button>
                <h3>Comments</h3>

                <div className="comments-container">
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                    <div className="comment" key={comment._id}>
                        <img
                            className="comment-profile-pic"
                            src={comment.profilePic}
                            alt={comment.username}
                        />
                        <div className="comment-content">
                            <h5 className="comment-username">{comment.username}</h5>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    </div>
                    ))
                )}
                </div>

                <div className="comment-input-container">
                    <input
                        type="text"
                        name="comment"
                        id="comment"
                        placeholder="Add a comment..."
                        ref={commentRef}
                        className="comment-input"
                    />
                    {commentRef.current.value && (
                        <FaArrowUp
                            onClick={sendComment}
                            className="send-comment-icon"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
