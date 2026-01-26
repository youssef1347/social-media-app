import React, { useRef, useState } from 'react'
import './VerifyEmail.css'
import { IoIosArrowBack } from "react-icons/io";
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Loading } from '../Loading/Loading';



export const VerifyEmail = () => {
    // get email from local storage
    const email = localStorage.getItem('email');
    console.log(email)

    // handle loading states
    const [loading, setLoading] = useState(false);

    // otp ref
    const otpRef = useRef();


    // class names state
    const [labelClassName, setLabelClassName] = useState('');


    // handle back function
    function handleBack() {
        window.history.back();
        console.log('back icon clicked');
    }


    // handle navigation
    const navigate = useNavigate();
    function go(endPoint) {
        navigate(endPoint);
    }


    // handle on change function
    function handleOnChange(ev) {
        const value = ev.target.value;
        setLabelClassName(value ? 'input-has-value' : '');

        // allow only numbers
        const index = value.split('');

        const numberRegex = /^[0-9]$/;
        for (let i = 0; i < index.length; i++) {
            if (!numberRegex.test(index[i])) {
                index[i] = '';
            }
        }
        ev.target.value = index.join('');
    }


    // handle submit function
    async function handleSubmit(e) {
        try {
            setLoading(true);

            e.preventDefault();
            console.log('form submitted');
    
            // submit logic
            const data = {
                email,
                otp: otpRef.current.value
            };

            const response = await api.post('api/auth/verify-otp', data);
            console.log(response);

            // success handling
            toast.success("Email verified successfully!");

            // remove email from local storage
            localStorage.removeItem('email');

            // navigation to home page
            go('/');
        } catch (error) {
            setLoading(true);
            console.log(error);

            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message);
            }

        } finally {
            setLoading(false);
        }
    }


    // loading page
    if (loading) {
            return (
                <Loading />
            )
    }


    // handle resend otp
    async function resendOtp() {
        try {
            const response = await api.post('api/auth/send-otp', email);
            console.log(response);
            console.log('first')
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
                {/* back icon container */}
                <div className="back-icon-container">
                <IoIosArrowBack
                    onClick={handleBack}
                    className='back-icon' />
                </div>

            <div className='verify-email-page'>

                {/* text container */}
                <div className='verify-email-text-container'>
                    <h1>Enter the Confirmation Code</h1>
                    <h5>To confirm your account, enter the 6-digit code we sent to <br /> {email}</h5>
                </div>

                {/* form container */}
                <div className="verify-email-form-container">
                    <form onSubmit={handleSubmit}>

                        {/* otp input */}
                        <input
                            type="text"
                            id='otp'
                            onChange={handleOnChange}
                            className='verify-email-input'
                            maxLength={6}
                            name='otp'
                            ref={otpRef}
                            />
                        <label
                            className={labelClassName}
                            htmlFor="otp">Confirmation code
                        </label>

                        {/* submit button */}
                        <button
                            type='submit'
                            className='verify-email-submit-btn'>
                                Verify
                        </button>

                        {/* resend otp button */}
                        <button
                            className='resend-otp-btn'
                            onClick={resendOtp}
                            type="button">I didn't get the code
                        </button>
                    </form>
                    <Link to={'/login'}>I already have an account</Link>
                </div>

            </div>
        </>
    )
}

