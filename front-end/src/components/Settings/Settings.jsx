import React from 'react';
import { FaMeta } from "react-icons/fa6";
import { IoPersonOutline, IoPersonCircleOutline, IoLockClosed } from "react-icons/io5";
import { MdOutlineVerifiedUser, MdOutlineDoNotDisturb } from "react-icons/md";
import { CiBookmark } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { LuSquareActivity } from "react-icons/lu";
import { GoStarFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import './Settings.css'


export const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className='settings-main-container'>
            <div className='settings-container'>
                <h4>Settings</h4>

                {/* accounts center container */}
                <div className="account-center-container">
                    <h5> <FaMeta className='meta-icon' /> Meta </h5>
                    <h5>Accounts center</h5>
                    <p>Manage your connected experiences and <br /> account settings across Meta technologies.</p>

                    {/* details container */}
                    <div className="details-container">
                        <h6 className='personal-heading'> <IoPersonOutline className='person-icon'/> Personal details </h6>
                        <h6 className='security-heading'> <MdOutlineVerifiedUser className='verified-icon'/> Password and security </h6>
                    </div>

                    <h6 className='see-more-link'>see more in accounts center</h6>
                </div>

                {/* how you use instagram container */}
                <div className="how-you-use-instagram-container">
                    <span>How you use Instagram</span>

                    {/* edit profile */}
                    <h5 onClick={() => navigate('/settings/edit-profile')} className='edit-profile-link'>
                        <IoPersonCircleOutline className='person-icon' /> Edit profile
                    </h5>

                    {/* saved posts */}
                    <h5 onClick={() => navigate('/saved-posts')} className='saved-posts-link'>
                        <CiBookmark className='save-icon' /> Saved
                    </h5>

                    {/* activity */}
                    <h5 onClick={() => navigate('/activity')} className='activity-link'>
                        <LuSquareActivity className='activity-icon' /> Your activity
                    </h5>
                </div>

                {/* who can see your content */}
                <div className="who-can-see-content-container">
                    <span>Who can see your content</span>

                    <h5 onClick={() => navigate('/settings/account-privacy')} className="account-privact">
                        <IoLockClosed className='lock-icon' /> Account privacy
                    </h5>

                    <h5 onClick={() => navigate('/settings/close-friends')} className="close-friends">
                        <GoStarFill className='star-icon' /> Close friends
                    </h5>

                    <h5 onClick={() => navigate('/blocked-users')} className="blocked-users">
                        <MdOutlineDoNotDisturb className='block-icon' /> Blocked users
                    </h5>

                    <h5 onClick={() => navigate('/activity-friends-tab')} className="activity-friends-tab">
                        <FiUsers className='users-icon' /> Activity in Friends tab
                    </h5>
                </div>
            </div>
        </div>
    )
}