import React from "react";
import "./Post.css";
import { SlOptions } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";


export const Post = ({
    profilePic,
    username,
    createdAt,
    isFollowing,
    postContent,
    likesCount,
    commentsCount,
    postCaption,
    toggleFollow,
    toggleLike,
    getComments,
    }) => {
    return (
        <div className="post-container">
            <div className="post-header">
                <div className="post-user-info-container">
                    <img
                        src={profilePic}
                        alt="profile picture"
                        className="post-profile-pic"
                    />
                    {/* profile picture */}
                    <div className="post-username-date-container">
                        <h4>{username}</h4> {/* username */}
                        <span>{createdAt}</span> {/* post created date */}
                    </div>
                </div>

                <div className="post-options-container">
                <button onClick={toggleFollow} className='post-follow-btn'>
                    {isFollowing ? "following" : "follow"}
                    {/* follow/unfollow button */}
                </button>
                <SlOptions className="post-options-icon" /> {/* post options icon */}
                </div>
            </div>

            {/* post content */}
            <div className="post-content">
                <img
                    src={postContent}
                    className="post-img"
                    alt="post" />
            </div>

            {/* post footer */}
            <div className="post-footer">
                <div className="post-actions-container">

                    {/* likes */}
                    <FaRegHeart className="post-like-icon" onClick={toggleLike}/> {/* like icon */}
                    <h5 className="likes-count">
                        {likesCount <= 0 ? "" : likesCount } {/* likes count */}
                    </h5>

                    {/* comments */}
                    <FaRegComment className="post-comment-icon" onClick={getComments}/> {/* comment icon */}
                    <h5 className="comments-Count">
                        {commentsCount <= 0 ? "" : commentsCount} {/* comments count */}
                    </h5>

                    {/* shares */}
                    <LuSend className="post-share-icon" /> {/* share icon */}

                    {/* saves */}
                    <CiBookmark className='post-save-icon' /> {/* save icon */}
                </div>

                <div className="post-caption-container">
                    {postCaption}
                </div>
            </div>
        </div>
    );
};
