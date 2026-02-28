import React, { useReducer, useRef, useState } from "react";
import "./Login.css";
import { FaMeta } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Inputs } from "../../components/Inputs/Inputs";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { Loading } from "../Loading/Loading";

export const Login = () => {
  // handling error states
  const [isError, setIsError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_ERROR_MESSAGE": {
          return { ...state, errorMessage: action.payload };
        }
        default:
          return state;
      }
    },
    { errorMessage: "" },
  );

  // handling loading state
  const [loading, setLoading] = useState(false);

  // refs
  const emailRef = useRef();
  const passwordRef = useRef();

  // handle login function
  async function handleLogin(ev) {
    try {
      ev.preventDefault();
      setLoading(true);
      console.log("login");

      const data = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      if (!data.email || !data.password) {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: {
            email: !data.email ? "email is required" : "",
            password: !data.password ? "password is required" : "",
          },
        });
        setLoading(false);
        return;
      }

      const response = await api.post("api/auth/login", data);
      localStorage.setItem("token", response.data.accessToken);
      toast.success("login successfully");
      go("/");
      console.log(response);
    } catch (error) {
      if (error.response?.data?.message !== "verify your email first") {
        
        toast.error(error.response?.data?.message);
        return;
      }

      toast.error(error.response?.data?.message);
      setIsError(true);
      await api.post("api/auth/send-otp");
    } finally {
      setLoading(false);
    }
  }

  // handle navigation
  const navigate = useNavigate();
  function go(endPoint) {
    navigate(endPoint);
  }

  // handle back function
  function handleBack() {
    navigate(-1);
  }

  // loading page
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="login-main-container">
      {/* images container */}
      <div className="login-images-container">
        <div className="login-instagram-logo-conainer">
          {/* instagram logo */}
          <img
            src="pngtree-instagram-logo-with-name-png-image_238618-removebg-preview.png"
            alt="instagram logo"
          />
        </div>

        {/* text container */}
        <div className="login-text-container">
          <h2>
            See everyday moments from <br /> your <span>close friends</span>.
          </h2>
        </div>

        {/* image 2 */}
        <div className="login-image2-container">
          <img src="image2.png" alt="" />
        </div>
      </div>

      {/* divider */}
      <div className="divider"></div>

      {/* form container */}
      <div className="login-form-container">
        {/* back icon conatiner */}
        <div className="back-icon-container">
          <IoIosArrowBack onClick={handleBack} className="back-icon" />
        </div>

        {/* text container */}
        <div className="text-container">
          <h3>Log into Instagram</h3>
        </div>

        {/* form */}
        <form className="login-form" onSubmit={handleLogin}>
          {/* email input */}
          <div className="login-email-input-container">
            <Inputs
              type="email"
              id="email"
              name="email"
              inputRef={emailRef}
              labelValue="email"
              errorMessage={state.errorMessage.email}
            />
          </div>

          {/* password input */}
          <div className="login-password-input-container">
            <Inputs
              type="password"
              id="password"
              name="password"
              inputRef={passwordRef}
              labelValue="password"
              errorMessage={state.errorMessage.password}
            />
          </div>

          {isError && (
            <h4 className="verify-email-link">
              otp sent to your email to verify your email <br />
              <Link to={"/verify-email"}>click here</Link>
            </h4>
          )}

          {/* submit button */}
          <button className="login-submit-button" type="submit">
            Login
          </button>

          {/* forgot password button */}
          <button
            onClick={() => go("/forgot-password")}
            className="forgot-password-button"
            type="button"
          >
            forgot password
          </button>

          {/* create account button */}
          <button
            className="create-account-button"
            onClick={() => go("/register")}
            type="button"
          >
            Create new account
          </button>

          {/* meta logo container */}
          <div className="meta-logo-container">
            <FaMeta />
            <h4>Meta</h4>
          </div>
        </form>
      </div>
    </div>
  );
};
