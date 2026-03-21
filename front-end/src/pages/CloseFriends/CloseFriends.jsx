import { IoIosArrowBack } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { getCloseFriends, toggleCloseFriend } from '../../utils/APIs/userApiCalls';
import { useState, useEffect } from 'react';
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export const CloseFriends = () => {
    const [following, setFollowing] = useState([]);
    const [closeFriends, setCloseFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // handle get close friends
    async function handleGetCloseFriends() {
        try {
            setLoading(true);
            const response = await getCloseFriends();
            setFollowing(response.data.following);
            setCloseFriends(response.data.closeFriends);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // handle toggle close friend
    async function handleToggleCloseFriend(id) {
        try {
            const response = await toggleCloseFriend(id);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    // search function
    function handleSearch(ev) {
        const searchValue = ev.target.value;

        if (searchValue == '') {
            return;
        }

        const fitleredFollowing = following.filter(user => user.username.includes(searchValue));
        setFollowing(fitleredFollowing);

        const fitleredCloseFriends = closeFriends.filter(user => user.username.includes(searchValue));
        setCloseFriends(fitleredCloseFriends);
    }

    useEffect(() => {
        handleGetCloseFriends();
    }, []);


    return (
        <>
            <div className="close-friends-main-container">
                <div className="close-friends-container">
                    <h4> <IoIosArrowBack onClick={() => navigate(-1)} /> Close friends</h4>
                </div>

                <div className="search-bar-container">
                    <IoMdSearch className="search-icon"/>
                    <input type="text" placeholder="Search" onChange={handleSearch} />
                </div>

                <div className="users-container">
                    {loading && <Spinner animation="border" size="sm" variant="primary" />}
                    {closeFriends.map((user) => {
                        return (
                            <div className="user-container" key={user._id}>
                                <img src={user.profilePic} alt="profile picture" />
                                <h5>{user.username}</h5>
                                <input
                                    type="checkbox"
                                    name="closeFriends"
                                    defaultChecked
                                    onChange={() => handleToggleCloseFriend(user._id)} />
                            </div>
                        )
                    })}

                    {following.map((user) => {
                        return (
                            <div className="user-container" key={user._id}>
                                <img src={user.profilePic} alt="profile picture" />
                                <h5>{user.username}</h5>
                                <input
                                    type="checkbox"
                                    name="following"
                                    onChange={() => handleToggleCloseFriend(user._id)} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
