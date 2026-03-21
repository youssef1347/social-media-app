import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/APIs/api";
import { Navbar } from "../../components/Navbar/Navbar";
import { PiGridNineFill } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa6";
import { BiRepost } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { IoLockClosedOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFollow,
  toggleBlock,
  toggleCloseFriend,
} from "../../utils/APIs/userApiCalls";
import { MdOutlineClose } from "react-icons/md";
import { VscStarFull } from "react-icons/vsc";
import { Spinner } from "react-bootstrap";

export const Profile = () => {
  // user id
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get the info of the user who sent the request
  const { user } = useSelector((state) => state.user);

  // private account state
  const [isPrivate, setIsPrivate] = useState(false);

  // user data state
  const [userData, setUserData] = useState(null);

  // loading states
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [addCloseFriendLoading, setAddCloseFriendLoading] = useState(false);

  // moadl state
  const [showModal, setShowModal] = useState(false);

  // state of follow request sent or not
  const [followRequest, setFollowRequest] = useState(false);

  // get the data of the profile
  async function getProfile() {
    try {
      setLoading(true);
      const userData = await api.get(`api/user/${id}`);
      setUserData(userData.data);
      console.log(userData);
    } catch (error) {
      console.log(error);
      // if the profile is private make isPrivate true
      if (error.response.status === 403) {
        setUserData(error.response.data);
        setIsPrivate(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [id]);
  console.log(userData);

  // handle follow user
  async function handleFollow() {
    try {
      setFollowLoading(true);
      // if the account is private send follow request
      if (isPrivate) {
        setFollowRequest(true);
        return;
      }
      await toggleFollow(userData?.profile?._id);
      // edit the fetched data
      setUserData((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing, //change the state of isFollowing
        followersLength: prev.isFollowing // change the followers length
          ? prev.followersLength - 1 // if the user unfollows decrease the followers length of the user by one
          : prev.followersLength + 1, // if the user follows increase the followers length of the user by one
        isCloseFriend: prev.isFollowing ? false : prev.isCloseFriend, // when the user unfollows, the user is no longer in close friends
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setFollowLoading(false);
    }
  }

  // handle add close friend
  async function handleAddCloseFriend() {
    try {
      setAddCloseFriendLoading(true);
      await toggleCloseFriend(userData?.profile?._id);
      setUserData((prev) => ({
        ...prev,
        isCloseFriend: !prev.isCloseFriend, // change the state of isCloseFriend
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setAddCloseFriendLoading(false);
    }
  }

  if (loading) {
    return <h1>loading</h1>;
  }

  // if (!userData) {
  //     return (
  //         <h1>user not found</h1>
  //     )
  // }

  return (
    <div className="profile-main-container">
      <Navbar profilePic={user?.avatar} id={user?._id} />

      <div className="profile-container">
        <div className="profile-data-container">
          {/* profile picture */}
          <div className="profile-pic-container">
            <img
              src={`http://localhost:5000/${userData?.profile?.avatar}`}
              alt="profile picture"
            />
          </div>

          {/* user data */}
          <div className="user-data-container">
            {/* username */}
            <h4 className="profile-username">{userData?.profile?.username}</h4>

            <div className="following-followers-length-container">
              {/* posts count */}
              <h5 className="profile-posts-length">
                {userData?.postsLength} posts
              </h5>

              {/* followers count */}
              <h5 className="profile-followers-length">
                {userData?.followersLength} followers
              </h5>

              {/* following count */}
              <h5 className="profile-following-length">
                {userData?.followingLength} following
              </h5>
            </div>

            {/* bio */}
            <p className="profile-bio">{userData?.profile?.bio}</p>

            {/* edit profile and follow buttons and message */}
            {!isPrivate && userData?.requesterIsProfileOwner ? ( // if the user who sent the request is the profile owner make edit profile btn
              <div className="action-button-container">
                <button
                  className="edit-profile-btn"
                  onClick={() => navigate("/settings/edit-profile")}
                >
                  edit profile
                </button>
              </div>
            ) : (
              !isPrivate && ( // if the account isn't private and the user is not the profile owner
                <div className="action-buttons-container">
                  {userData?.isFollowing ? ( // if the user is following the profile owner
                    <button
                      onClick={() => setShowModal(true)}
                      className={`follow-unfollow-button following ${userData?.isCloseFriend && "close-friend"}`}
                    >
                      {followLoading ? ( // if the loading state is true show the spinner
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "following"
                      )}{" "}
                      <IoIosArrowDown />
                    </button>
                  ) : (
                    // if the user is not following the profile owner and the account isn't private
                    <button
                      onClick={() => {
                        handleFollow();
                      }}
                      className="follow-unfollow-button follow-button"
                    >
                      {followLoading ? ( // loading state condition
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "follow"
                      )}
                    </button>
                  )}
                  <button className="message-btn">message</button>
                </div>
              )
            )}

            {/* send follow reuest button */}
            {isPrivate ? (
              <div className="action-buttons-container">
                <button
                  className={
                    followRequest
                      ? "requested-btn"
                      : "follow-private requested-btn"
                  }
                  onClick={() => {
                    setFollowRequest(!followRequest);
                  }}
                >
                  {followRequest ? "Requested" : "Follow"}
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* the modal */}
        {showModal && (
          <div className="unfollow-modal-container">
            {/* close icon */}
            <div className="unfollow-modal-close-icon-container">
              <MdOutlineClose
                className="unfollow-modal-close-icon"
                onClick={() => setShowModal(false)}
              />
            </div>
            {/* profile picture */}
            <div className="avatar-container">
              <img src={`http://localhost:5000/${userData?.profile?.avatar}`} />
            </div>
            <div className="modal-divider"></div>
            <div className="unfollow-modal-actions-container">
              <h6
                onClick={() => {
                  handleAddCloseFriend();
                }}
              >
                {userData?.isCloseFriend // check if the profile owner is in close friends of the user
                  ? "close friend"
                  : "add to close friends list"}
                {addCloseFriendLoading ? ( // if the loading state is true show the spinner
                  <Spinner animation="border" size="sm" variant="light" />
                ) : (
                  <VscStarFull className="close-friend-icon" />
                )}
              </h6>
            </div>
            <h6
              onClick={() => {
                // unfollow button
                setShowModal(false);
                handleFollow();
              }}
            >
              unfollow
            </h6>
            <h6 onClick={() => toggleBlock(userData.profile._id)}>block</h6>{" "}
            {/* block button */}
          </div>
        )}

        {/* posts section */}
        {!isPrivate ? ( // if the account isn't private show the posts of user
          <div className="posts-section-container">
            <div className="posts-action-icons">
              <PiGridNineFill className="profile-posts-icon" />
              <FaRegBookmark className="profile-saved-posts-icon" />
              <BiRepost className="profile-reposted-posts-icon" />
            </div>

            <div className="profile-divider"></div>

            <div className="posts-container">
              {userData?.posts?.map((post) => {
                return (
                  <div className="profile-media-container" key={post?._id}>
                    <img src={`http://localhost:5000/${post?.mediaUrl[0]}`} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // if the account is private show the private section
          <div className="private-posts-section">
            <div className="private-divider"></div>

            <div className="private-text-container">
              <div className="lock-icon-container">
                <IoLockClosedOutline className="private-lock-icon" />
              </div>

                <div className="private-text">
                  <h6>This profile is private</h6>
                  <span>Follow to see their photos and videos.</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
