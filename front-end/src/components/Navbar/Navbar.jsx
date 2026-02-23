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



export const Navbar = () => {
    return (
        <>
            {/* navber container */}
            <div className="navbar-container">

                {/* icons container */}
                <div className="navbar-icons-container">

                    <FaInstagram className='navbar-instagram-icon' /> { /* instagram icon */}
                    <GoHomeFill className='navbar-home-icon' /> { /* home icon */}
                    <GoVideo className='navbar-reels-icon' /> { /* reels icon */}
                    <LuSend className='sendMsg-icon' /> { /* send message icon */}
                    <IoSearchOutline className='search-icon' /> { /* search icon */}
                    <SlCompass className='explore-icon' /> { /* explore icon */}
                    <CiHeart className='notification-icon' /> { /* notification icon */}
                    <FiPlus className='create-icon' /> { /* create post icon */}
                    <FiPlus className='create-icon' /> { /* create post icon */}
                    {/* profile icon here */}
                    <IoMdMenu className='menu-icon' /> { /* menu bar icon */}

                </div>

                <div className="navbar-icon-name-container">

                    <h4>hello</h4>
                    <h4>Home</h4>
                    <h4>Reels</h4>
                    <h4>Messages</h4>
                    <h4>Search</h4>
                    <h4>Explore</h4>
                    <h4>Notifications</h4>
                    <h4>Create</h4>
                    <h4>Profile</h4>
                    <h4>Menu</h4>

                </div>
            </div>
        </>
    )
}

