import React, { useRef, useState } from "react";
import "./ForgotPassword.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Inputs } from "../../components/Inputs/Inputs";
import { api } from "../../utils/api";
import Spinner from "react-bootstrap/Spinner";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  // navigate
  const navigate = useNavigate();

  // handle loading state
  const [loading, setLoading] = useState(false);

  // error messages handling
  const [isError, setIsError] = useState("");

  // email ref
  const emailRef = useRef();

  // back function
  function handleBack() {
    navigate(-1);
  }

  // handle forgetting password
  async function handleForgotPassword(ev) {
    try {
      ev.preventDefault();
      setLoading(true);
      console.log("button clicked");
      setIsError("");

      const email = emailRef.current.value;
      if (!email) {
        setIsError("You'll need to enter an email to continue");
        return;
      }

      const response = await api.post("api/auth/forgot-password", { email });
      console.log("response");
      console.log(response);

      toast.success(
        `We sent an email to ${email} with a link to get back into your account.`,
      );
    } catch (error) {
      console.log(error);
      setIsError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-password-page-container">
      {/* back icon container */}
      <div className="forgot-password-back-icon-container">
        <IoIosArrowBack
          onClick={handleBack}
          className="forgot-password-back-icon"
        />
      </div>
      {/* text container */}
      <div className="forgot-password-text-container">
        <h2>Find your account</h2>
        <h4>Enter your email</h4>
      </div>

      <form onSubmit={handleForgotPassword} className="forgot-password-form">
        {/* input */}
        <div className="forgot-password-input-container">
          <Inputs
            type="email"
            id="email"
            labelValue="Email"
            name="email"
            inputRef={emailRef}
            errorMessage={isError}
          />
        </div>

        {/* continue button */}
        <button
          disabled={loading}
          className="forgot-password-btn"
          type="submit"
          style={
            loading
              ? { cursor: "not-allowed", backgroundColor: "#3b48fc3d" }
              : {}
          }
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Continue"}
        </button>
      </form>
    </div>
  );
};
