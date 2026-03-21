import "./AccountPrivacy.css";
import { Settings } from "../../components/Settings/Settings";
import { Navbar } from "../../components/Navbar/Navbar";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { api } from "../../utils/APIs/api";
import { RiVideoLine, RiThreadsLine } from "react-icons/ri";
import { FiRepeat } from "react-icons/fi";
import { BsGearWide } from "react-icons/bs";

export const AccountPrivacy = () => {
  // privacy state
  const [isPrivate, setIsPrivate] = useState(false);

  // class name state
  const [showModal, setShowModal] = useState(false);

  // const [checked, setChecked] = useState(isPrivate ? true : false);

  // handle privacy change
  function handlePrivacyChange(ev) {
    setShowModal(true);
  }

  // get user privacy
  async function getUserPrivacy() {
    try {
      const response = await api.get("/api/user/privacy");
      setIsPrivate(response.data.privateAccount);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserPrivacy();
  }, []);

  // change privacy
  async function changePrivacy() {
    try {
      const response = await api.put("/api/user/change-privacy", {
        privateAccount: !isPrivate,
      });
      setIsPrivate(!isPrivate);
      // setChecked(!checked);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className={`account-privacy-main-container ${showModal ? "blur" : ""}`}
      >
        <Navbar />
        <Settings />
        <div className="account-privacy-container">
          <h4>Account Privacy</h4>

          <div className="account-privacy-check-container">
            <form onSubmit={changePrivacy}>
              <div className="account-privacy-check">
                <h5>Private account</h5>
                <Form.Check
                  type="switch"
                  id="privateAccount"
                  checked={isPrivate}
                  onChange={handlePrivacyChange}
                  name="privateAccount"
                />
              </div>
            </form>
          </div>

          <div className="text-container">
            <p className="text-1">
              When your account is public, your profile and posts can be seen by
              anyone, on or off Instagram, even if they don't <br /> have an
              Instagram account.
            </p>

            <p className="text-2">
              When your account is private, only the followers you approve can
              see what you share, including your photos or <br /> videos on
              hashtag and location pages, and your followers and following
              lists. Certain info on your profile, like your <br /> profile
              picture and username, is visible to everyone on and off Instagram.
              Learn more
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="change-privacy-modal-container">
          <h3>Switch to {isPrivate ? "public" : "private"} account?</h3>

          <div className="change-privacy-details">
            <h5>
              <RiVideoLine className="change-privacy-icon" />
              {isPrivate ? (
                <p>
                  Anyone can see your posts, reels and stories, and can use your{" "}
                  <br />
                  original audio and text.
                </p>
              ) : (
                <p>
                  Only your followers will be able to see your photos and
                  videos.
                </p>
              )}
            </h5>

            <h5>
              <RiThreadsLine className="change-privacy-icon" />
              {isPrivate ? (
                <p>This won't change who can message, tag or @mention you.</p>
              ) : (
                <p>
                  This won't change who can message, tag or @mention you, but
                  you <br />
                  won't be able to tag people who don't follow you.
                </p>
              )}
            </h5>

            <h5>
              <FiRepeat className="change-privacy-icon" />
              {isPrivate ? (
                <p>
                  People can reuse all or part of your posts and reels in
                  features like <br />
                  remixes, sequences, templates and stickers and download them
                  as <br />
                  part of their reel or post.
                </p>
              ) : (
                <p>
                  No one can reuse your content. All reels, posts and stories
                  that <br />
                  previously used your content in features like remixes,
                  sequences, <br />
                  templates or stickers will be deleted. If you switch back to a
                  public <br />
                  account within 24 hours, they will be restored.
                </p>
              )}
            </h5>

            {isPrivate && (
              <h5>
                <BsGearWide className="change-privacy-icon" />
                <p>
                  You can turn off reuse for each post or reel or change the
                  default in <br />
                  your settings.
                </p>
              </h5>
            )}
          </div>

          <div className="change-privacy-buttons-container">
            <div className="modal-divider"></div>
            <button
              type="submit"
              onClick={() => {
                changePrivacy();
                setIsPrivate(!isPrivate);
                setShowModal(false);
              }}
              className="change-privacy-submit-btn"
            >
              switch to {isPrivate ? "public" : "private"}
            </button>
            <div className="modal-divider"></div>
            <button
              onClick={() => setShowModal(false)}
              className="change-privacy-cancel-btn"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
