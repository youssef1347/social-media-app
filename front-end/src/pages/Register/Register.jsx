import React, { useState, useRef } from 'react'
import './Register.css'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

export const Register = () => {
    // show password function
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }


    // refs
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    // handle register function
    async function handleRegister(e) {
        e.preventDefault();

        try {
            const data = {
            email: emailRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value
            }
        } catch (error) {
            
        }
    }

    return (
        <div className="registerPage-container">

            {/* instagram logo container */}
            <div className='instagram-icon-container'>
                <img src="pngtree-instagram-logo-with-name-png-image_238618-removebg-preview.png"
                alt="instagram logo" />
            </div>

            {/* divider */}
            <div className="divider"></div>

            {/* register form container */}
            <div className="registerForm-container">
                <form className="register-form">

                    {/* username input */}
                    <div>
                        <label htmlFor="username">username</label>
                        <input 
                            className="username-input" 
                            type="text" 
                            placeholder='Username'
                            ref={usernameRef}
                            />
                    </div>

                    {/* email input */}
                    <div>
                        <label htmlFor="email">email</label>
                        <input 
                            type="email" 
                            placeholder='Email' 
                            ref={emailRef}
                            />
                    </div>

                    {/* password input */}
                    <div>
                        <label htmlFor="password">password</label>
                        <input
                            className="password-input"
                            placeholder='Password'
                            type={showPassword ? "text" : "password"}
                            ref={passwordRef}
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

                    {/* submit button */}
                    <button type="submit">create account</button>
                    <button className="haveAccount">I already have an account</button>
                </form>
            </div>
        </div>
    )
}
