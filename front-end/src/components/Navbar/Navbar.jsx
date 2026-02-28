import React from 'react'
import './Navbar.css';
import { FaInstagram } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { LuSend } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { GoVideo } from "react-icons/go";
import { SlCompass } from "react-icons/sl";
import { IoMdMenu } from "react-icons/io";
import "animate.css";
import { NavLink } from 'react-router-dom';



export const Navbar = ({profilePic}) => {
    return (
        <>
            {/* navbar container */}
            <div className="navbar-container">

                <div className="navbar-instagram-logo-container ">
                    <FaInstagram className='navbar-instagram-logo' />
                </div>

                {/* home link */}
                <NavLink to="/">
                    <div className="home-link-container">
                        <GoHomeFill className='navbar-home-icon' />
                        <h5>Home</h5>
                    </div>
                </NavLink>

                {/* reels link */}
                <NavLink to="/reels">
                    <div className="reels-link-container">
                        <GoVideo className='navbar-reels-icon' />
                        <h5>Reels</h5>
                    </div>
                </NavLink>

                {/* messages link */}
                <NavLink to="/messages">
                    <div className="messages-link-container">
                        <LuSend className='navbar-messages-icon' />
                        <h5>Messages</h5>
                    </div>
                </NavLink>

                {/* search link */}
                <NavLink to="/search">
                    <div className="search-link-container">
                        <IoSearchOutline className='navbar-search-icon' />
                        <h5>Search</h5>
                    </div>
                </NavLink>

                {/* explore link */}
                <NavLink to="/explore">
                    <div className="explore-link-container">
                        <SlCompass className='navbar-explore-icon' />
                        <h5>Explore</h5>
                    </div>
                </NavLink>

                {/* notifications link */}
                <NavLink to="/notifications">
                    <div className="notifications-link-container">
                        <CiHeart className='navbar-notifications-icon' />
                        <h5>Notifications</h5>
                    </div>
                </NavLink>

                {/* create post link */}
                <NavLink to='/create-post'>
                    <div className="create-post-link-container">
                        <FiPlus className='navbar-create-post-icon' />
                        <h5>Create</h5>
                    </div>
                </NavLink>

                {/* profile link */}
                <NavLink to='/profile'>
                    <div className="profile-link-container">
                        <img src={profilePic} width="20" height="20" alt="profile" className='navbar-profile-pic' />
                        <h5>Profile</h5>
                    </div>
                </NavLink>

                {/* menu link */}
                <NavLink to='/menu'>
                    <div className="menu-link-container">
                        <IoMdMenu className='navbar-menu-icon' />
                        <h5>Menu</h5>
                    </div>
                </NavLink>

            </div>
        </>
    )
}

