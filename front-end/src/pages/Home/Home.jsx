import React, { useState } from "react";
import "./Home.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { api } from "../../utils/APIs/api";
import { useEffect } from "react";
import { Post } from "../../components/Post/Post";
import { Reels } from "../../components/Reels/Reels";

export const Home = () => {
  // posts state
  const [posts, setPosts] = useState([]);

  // get user profile picture
  const [profilePicture, setProfilePicture] = useState("");

  const [id, setId] = useState(null);

  // toggle like function
  async function toggleLike(postId) {
    try {
      const response = await api.post(`/api/post/like-post/${postId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // toggle follow function
  async function toggleFollow(id) {
    try {
      const response = await api.put(`api/user/follow/${id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // fetch posts
  useEffect(() => {
    async function fetchHomeInfo() {
      try {
        const response = await api.get("/api/user/");
        setProfilePicture(response.data.user.avatar);
        console.log(response);
        setPosts(response.data.posts);
        setId(response.data.user._id);
      } catch (error) {
        console.log(error);
      }
    }
    fetchHomeInfo();
  }, []);

  return (
    <>
      <Navbar
        profilePic={profilePicture || "default-profile-pic.jpg"}
        id={id}
      />
      {posts.map((post) => {
        if (post.mediaType === "image") {
          return (
            <Post
              key={post._id}
              profilePic={post.userId.avatar}
              username={post.userId.username}
              createdAt={post.createdAt}
              mediaUrls={post.mediaUrl}
              likesCount={post.likesCount || post.likes.length}
              commentsCount={post.commentsCount}
              postCaption={post.caption}
              toggleLike={() => toggleLike(post._id)}
              toggleFollow={() => toggleFollow(post.userId._id)}
              isLiked={post.isLiked}
              isFollowing={post.isFollowing}
            />
          );
        } else {
          return (
            <Reels
              key={post._id}
              profilePic={post.userId.avatar}
              username={post.userId.username}
              reelContent={post.mediaUrl[0]}
              likesCount={post.likesCount || post.likes.length}
              commentsCount={post.commentsCount}
              reelCaption={post.caption}
              toggleLike={() => toggleLike(post._id)}
              toggleFollow={() => toggleFollow(post.userId._id)}
              isLiked={post.isLiked}
              isFollowing={post.isFollowing}
            />
          );
        }
      })}
    </>
  );
};
