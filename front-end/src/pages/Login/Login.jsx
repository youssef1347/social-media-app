import React, { useRef } from 'react'
import './Login.css'
import { FaMeta } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Inputs } from '../../components/Inputs/Inputs';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export const Login = () => {

  // handle back function
  function handleBack() {
    window.history.back();
  }

  // refs
  const emailRef = useRef();
  const passwordRef = useRef();


  // handle login function
  async function handleLogin(ev) {
    try {
      ev.preventDefault();
      console.log('login')

      const data = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }

      if (!data.email || !data.password) {
        toast.error('email and password are required');
      }

      const response = await api.post('api/auth/login', data);
      toast.success('login successfully')
      console.log(response);
    } catch (error) {
      if (error.response?.data?.message) {

      }
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }


  // handle navigation
  const navigate = useNavigate();
  function go(endPoint) {
    navigate(endPoint);
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
        <form onSubmit={handleLogin}>
          {/* email input */}
          <Inputs
            type ='email'
            id ='email'
            name='email'
            ref={emailRef}
            labelValue='email'
          />

          {/* password input */}
          <Inputs
            type='password'
            id='password'
            name='password'
            ref={passwordRef}
            labelValue='password'
          />

          {/* submit button */}
          <button className="login-submit-button" type="submit">
            Login
          </button>

          {/* forgot password button */}
          <button
            onClick={() => go('/forgot-password')}
            className="forgot-password-button"
            type="button">
              forgot password
          </button>

          {/* create account button */}
          <button
            className="create-account-button"
            onClick={() => go('/register')}
            type="button">
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
}
