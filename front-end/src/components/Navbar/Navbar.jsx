import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FaInstagram } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import { LuSend } from "react-icons/lu";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { GoVideo, GoHomeFill } from "react-icons/go";
import { SlCompass } from "react-icons/sl";
import { IoMdMenu } from "react-icons/io";
import { BsGearWide } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { logout } from "../../utils/APIs/userApiCalls";
import { clearUser, setUser } from "../../store/slices/userSlice";
import { api } from "../../utils/APIs/api";
import { createPost } from "../../utils/APIs/postApiCalls";

export const Navbar = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const dispatch = useDispatch();

  // post ref
  const postRef = useRef();

  // caption ref
  const captionRef = useRef();

  // show post content state
  const [previewPostContent, setPreviewPostContent] = useState(false);

  // create post function
  async function handleCreatePost(ev) {
    ev.preventDefault();
    await createPost(captionRef.current?.value, postRef.current.files);
    setPreviewPostContent(true);
  }

  async function getUserMainInfo() {
    try {
      const response = await api.get("/api/user/me");
      dispatch(setUser(response.data.user));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserMainInfo();
  }, []);

  const { user } = useSelector((state) => state.user);
  console.log(user);

  // create post modal
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const [openNotifications, setOpenNotification] = useState(false);

  return (
    <div className="navbar-main-container">
      {/* navbar container */}
      <div
        className={`navbar-container ${openMenu ? "navbar-container-static" : "navbar-container-active"}`}
      >
        <div className="navbar-instagram-logo-container ">
          <FaInstagram className="navbar-instagram-logo" />
        </div>

        {/* home link */}
        <NavLink to="/">
          <div className="home-link-container">
            <GoHomeFill className="navbar-home-icon" />
            <h5>Home</h5>
          </div>
        </NavLink>

        {/* reels link */}
        <NavLink to="/reels">
          <div className="reels-link-container">
            <GoVideo className="navbar-reels-icon" />
            <h5>Reels</h5>
          </div>
        </NavLink>

        {/* messages link */}
        <NavLink to="/messages">
          <div className="messages-link-container">
            <LuSend className="navbar-messages-icon" />
            <h5>Messages</h5>
          </div>
        </NavLink>

        {/* search link */}
        <NavLink to="/search">
          <div className="search-link-container">
            <IoSearchOutline className="navbar-search-icon" />
            <h5>Search</h5>
          </div>
        </NavLink>

        {/* explore link */}
        <NavLink to="/explore">
          <div className="explore-link-container">
            <SlCompass className="navbar-explore-icon" />
            <h5>Explore</h5>
          </div>
        </NavLink>

        {/* notifications link */}
        <div
          className="notifications-link-container"
          onClick={() => setOpenNotification((prev) => !prev)}
        >
          <CiHeart className="navbar-notifications-icon" />
          <h5>Notifications</h5>
        </div>

        {/* create post link */}
        <div
          className="create-post-link-container"
          onClick={() => setShowCreatePostModal(true)}
        >
          <FiPlus className="navbar-create-post-icon" />
          <h5>Create</h5>
        </div>

        {showCreatePostModal && (
          <div className="create-post-modal-container">
            <h4>Create new post</h4>

            <div className="modal-divider"></div>

            <MdOutlinePhotoLibrary />
            <h5>Drag photos and videos here</h5>

            {/* input container */}
            <div className="create-post-input-container">
              <form>
                <label htmlFor="post">Select from computer</label>
                <input type="file" name="post" id="post" hidden multiple ref={postRef} />
              </form>
            </div>

            {/* preview post */}
            {previewPostContent && (
              <div className="preview-post-container">
                <img src={postRef.current.files[0]} alt="post preview" />
              </div>
            )}
          </div>
        )}

        {/* profile link */}
        <NavLink to={`/${user?._id}`}>
          <div className="profile-link-container">
            <img
              src={`http://localhost:5000/${user?.avatar}`}
              width="20"
              height="20"
              alt="profile"
              className="navbar-profile-pic"
            />
            <h5>Profile</h5>
          </div>
        </NavLink>

        {/* // menu link */}
        <div
          className="menu-link-container"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <IoMdMenu className="navbar-menu-icon" />
          <h5>More</h5>

          {openMenu && (
            <div className="menu-modal-container">
              <h6
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/settings/edit-profile");
                }}
              >
                <BsGearWide className="navbar-lock-icon" /> Settings
              </h6>

              <div className="modal-divider"></div>

              <h6 onClick={() => setDarkTheme(!darkTheme)}>
                Dark mode
                <Form.Check
                  type="switch"
                  id="darkMode"
                  defaultChecked={darkTheme}
                  name="darkMode"
                  onChange={() => {
                    setDarkTheme(!darkTheme)
                    localStorage.setItem('darkTheme', darkTheme);
                  }}
                  style={{ marginLeft: "30px" }}
                />
              </h6>

              <div className="modal-divider"></div>

              <h6
                onClick={async () => {
                  await logout();
                  dispatch(clearUser());
                  navigate("/login");
                }}
              >
                Logout
              </h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
