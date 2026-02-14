import React, { useRef, useState } from 'react'
import './ForgotPassword.css'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { Inputs } from '../../components/Inputs/Inputs';
import { api } from '../../utils/api';

export const ForgotPassword = () => {
  // navigate
  const navigate = useNavigate();


  // error messages handling
  const [isError, setIsError] = useState('');

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
      console.log('button clicked');

      const email = emailRef.current.value;
      if (!email) {
        setIsError("You'll need to enter an email to continue");
        return;
      }

      const response = await api.post('api/auth/forgot-password', { email });
      console.log('response');
      console.log(response);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="forgot-password-page-container">
      {/* back icon container */}
      <div className="forgot-password-back-icon-container">
        <IoIosArrowBack onClick={handleBack} className="forgot-password-back-icon" />
      </div>
        {/* text container */}
        <div className="forgot-password-text-container">
          <h2>Find your account</h2>
          <h4>Enter your email</h4>
        </div>

      <form
        onSubmit={handleForgotPassword}
        className='forgot-password-form'>
        {/* input */}
        <Inputs
          type='email'
          id='email'
          labelValue='Email'
          name='email'
          inputRef={emailRef}
          errorMessage={isError}
        />

        {/* continue button */}
        <button
          className='forgot-password-btn'
          type="submit">Continue</button>
      </form>

    </div>
  );
}
