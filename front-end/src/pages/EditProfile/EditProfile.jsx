import React, { useEffect, useRef, useState } from "react";
import "./EditProfile.css";
import { api } from "../../utils/APIs/api";
import Form from "react-bootstrap/Form";
import { Navbar } from "../../components/Navbar/Navbar";
import { Settings } from "../../components/Settings/Settings";
import toast from "react-hot-toast";

export const EditProfile = () => {
  // loading state
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState(null);

  const bioRef = useRef();
  const avatarRef = useRef();

  // submit function
  async function editProfile(ev) {
    ev.preventDefault();

    const files = avatarRef.current.files;

    // handling error if the user did not sent the data
    if (bioRef.current?.value === "" && files.length === 0) {
      toast.error("you must choose at least one file or fill the bio field");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("avatar", files[0]);

      formData.append("bio", bioRef.current?.value || "");
      console.log(formData);
      console.log(bioRef);
      console.log(avatarRef);
      console.log(files[0]);

      const response = await api.patch("/api/user/edit", formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // get bio and avatar of the user
  async function getBioAndAvatar() {
    try {
      const response = await api.get("/api/user/edit-profile-info");
      console.log(response);
      setInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBioAndAvatar();
  }, []);

  return (
    <div className="edit-profile-main-container">
      <Navbar
        profilePic={`http://localhost:5000/${info?.avatar}`}
        id={info?._id}
      />
      <Settings />
      <div className="edit-profile-container">
        <h3>Edit profile</h3>

        <form onSubmit={editProfile} className="edit-profile-form">
          <div className="edit-profile-pic-container">
            <img
              src={
                `http://localhost:5000/${info?.avatar}` ||
                "default-profile-pic.jpg"
              }
              alt="avatar"
            />
            <h5>{info?.username}</h5>
            <input
              type="file"
              name="avatar"
              id="avatar"
              ref={avatarRef}
              hidden
            />
            <label htmlFor="avatar" className="edit-profile-label">
              change photo
            </label>
          </div>

          <textarea
            ref={bioRef}
            defaultValue={info?.bio || ""}
            name="bio"
            id="bio"
            className="edit-profile-bio"
          />

          <button
            type="submit"
            disabled={loading}
            className={` edit-profile-submit-btn ${loading ? "disabled" : ""}`}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
