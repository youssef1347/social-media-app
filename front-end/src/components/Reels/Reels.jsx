import React, { useRef, useState } from 'react'
import './Reels.css';
import { SlOptions } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { GoUnmute } from "react-icons/go";
import { GoMute } from "react-icons/go";
import { FaPlay } from "react-icons/fa";



export const Reels = ({
    profilePic,
    username,
    isFollowing,
    reelContent,
    likesCount,
    commentsCount,
    reelCaption,
    toggleFollow,
    toggleLike,
    getComments,
}) => {
    // video ref
    const videoRef = useRef();

    // mute/unmute state
    const [muted, setIsMuted] = useState(true);

    // toggle mute/unmute
    function toggleMute() {
        if (muted) {
            videoRef.current.muted = false;
        } else {
            videoRef.current.muted = true;
        }
        setIsMuted(!muted);
    }

    // play/pause state
    const [isPlaying, setIsPlaying] = useState(true);

    // toggle play/pause
    function togglePlay() {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }

    return (
        <div className="reels-main-container">
            <div className="reels-action-container">

                {/* likes */}
                <FaRegHeart
                    onClick={toggleLike}
                    className="reels-like-icon"
                /> 
                <h5 className="likesCount">
                    {likesCount <= 0 ? "" : likesCount } {/* likes count */}
                </h5>

                {/* comments */}
                <FaRegComment
                    onClick={getComments}
                    className="reels-comment-icon"
                />
                <h5 className="commentsCount">
                    {commentsCount <= 0 ? "" : commentsCount } {/* comments count */}
                </h5>

                {/* shares */}
                <LuSend className="reels-share-icon" />

                {/* save */}
                <CiBookmark className="reels-save-icon" />

                {/* options */}
                <SlOptions className="reels-options-icon" />

            </div>

            <div className="reels-content-container">
                <div className="reels-user-info-container">

                    {/* profile picture */}
                    <img
                        className='reels-profile-pic'
                        src={profilePic}
                        alt={username}
                    />

                    {/* username */}
                    <h5 className="reels-username">{username}</h5>

                    {/* follow button */}
                    <button className="reels-follow-btn" onClick={toggleFollow}>
                        {isFollowing ? "Following" : "Follow"}
                    </button>

                    {/* caption */}
                    <p className="reels-caption">{reelCaption}</p>

                </div>


                {/* reel content */}
                <div className="reels-video-container">

                    {muted ? (
                        <GoUnmute
                            onClick={toggleMute}
                            className="reels-unmute-icon" />
                    ) : (
                        <GoMute
                            onClick={toggleMute}
                            className="reels-mute-icon" />
                    )}

                    {!isPlaying && (
                        <FaPlay
                            onClick={togglePlay}
                            className="reels-play-icon" />
                    )}

                    <video
                        className="reels-video"
                        controls={false}
                        autoPlay
                        loop
                        muted={muted}
                        ref={videoRef}
                        onClick={togglePlay}
                        src={reelContent}
                    >
                    </video>
                </div>
            </div>
        </div>
    )
}
