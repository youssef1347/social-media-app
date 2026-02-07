import React, { useState, useRef } from 'react'
import './Register.css'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../Loading/Loading';
import { Inputs } from '../../components/Inputs/Inputs';


export const Register = () => {
    const [loading, setLoading] = useState(false);


    // show password function
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }


    // navigate
    const navigate = useNavigate();
    function go(endPoint) {
        navigate(endPoint);
    }

    // refs
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    // handle register function
    async function handleRegister(e) {
        e.preventDefault();
        console.log('register button clicked');

        try {
            setLoading(true);

            const data = {
            email: emailRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            }

            // confirm password validation
            if (passwordRef.current.value !== confirmPasswordRef.current.value) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }

            // api call
            const response = await api.post('api/auth/register', data);
            const email = response.data.email;
            localStorage.setItem('email', email);
            console.log(response);
            toast.success("Registration successful! please verify your email.");

            // navigate to verify email page
            go('/verify-email');

            // api call to send verification email
            const otpRes = await api.post('api/auth/send-otp', { email });
            console.log(otpRes);

        } catch (error) {
            setLoading(true);

            // error handling
            if (error.response?.data?.messages) {
                error.response.data.messages.forEach(msg => {
                    toast.error(msg);
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return (
            <Loading />
        )
    }


    return (
        <>
            
            <div className="registerPage-container">

                {/* instagram logo container */}
                <div className='instagram-icon-container'>
                    <img
                        src="pngtree-instagram-logo-with-name-png-image_238618-removebg-preview.png"
                        alt="instagram logo" />
                    <h6>from</h6>
                    <img src="images-removebg-preview.png" alt="meta icon" />
                </div>

                {/* divider */}
                <div className="divider"></div>

                {/* register form container */}
                <div className="registerForm-container">
                    <form
                        className="register-form"
                        onSubmit={handleRegister}>

                        {/* username input */}
                        <div className='register-username-input-container'>
                            <Inputs
                                className='register-username-input'
                                type='text'
                                name='username'
                                id='username'
                                inputRef={usernameRef}
                                labelValue='username'
                            />
                        </div>

                        {/* email input */}
                        <div className='regsiter-email-input-container'>
                            <Inputs
                                type='email'
                                id='email'
                                name='email'
                                labelValue='email'
                                inputRef={emailRef}
                            />
                        </div>

                        {/* password input */}
                        <div className='register-password-input-container'>
                            <Inputs
                                id='password'
                                type={showPassword ? "text" : "password"}
                                labelValue='password'
                                inputRef={passwordRef}
                                name='password'
                            />
                            {showPassword ? <FaRegEye
                                    className='slash-eye-icon'
                                    onClick={handleShowPassword}
                            /> :
                                <FaRegEyeSlash
                                    className='slash-eye-icon'
                                    onClick={handleShowPassword} />
                            }
                        </div>

                        {/* confirm password input */}
                        <div className='register-confirmPassword-input-container'>
                            {/* <label htmlFor="confirmPassword">confirm password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                ref={confirmPasswordRef}
                            /> */}
                            <Inputs
                                id='confirm password'
                                type='password'
                                inputRef={confirmPasswordRef}
                                labelValue='confirm password'
                            />
                        </div>

                        {/* submit button */}
                        <button type='submit'>create account</button>
                        <div className='haveAccount-btn'>
                            <button
                                type='button'
                                className="haveAccount"
                                onClick={() => go('/login')}
                            >I already have an account</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
