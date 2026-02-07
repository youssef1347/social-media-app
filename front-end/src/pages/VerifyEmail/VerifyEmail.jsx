import React, { useEffect, useRef, useState } from 'react'
import './VerifyEmail.css'
import { IoIosArrowBack } from "react-icons/io";
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Loading } from '../Loading/Loading';



export const VerifyEmail = () => {
    // get email from local storage
    const email = localStorage.getItem('email');

    // handle loading states
    const [loading, setLoading] = useState(false);

    // otp ref
    const otpRef = useRef();


    // timer state
    const [timer, setTimer] = useState(0);
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;


    // handle resend otp state
    const [isResendOtp, setIsResendOtp] = useState(false);


    // label class names state
    const [labelClassName, setLabelClassName] = useState('');


    // handle navigation
    const navigate = useNavigate();
    function go(endPoint) {
        navigate(endPoint);
    }

    // handle back function
    function handleBack() {
        navigate(-1);
    }


    // handle allowing only numbers in otp input
    function handleOnChange(ev) {
        const value = ev.target.value;

        // change the class name according to the value
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


    // handle verify email function
    async function handleVerifyEmail(e) {
        try {
            
            e.preventDefault();
            console.log('form submitted');
    
            // submit logic
            const data = {
                email,
                otp: otpRef.current.value
            };

            if (!data.otp) {
                toast.error("otp is reuired");
                return;
            } else if (data.otp.length < 6) {
                toast.error('otp must be 6 characters');
                return;
            }

            const response = await api.post('api/auth/verify-otp', data);
                setLoading(true);
            console.log(response);

            // success handling
            toast.success("Email verified successfully!");

            // remove email from local storage
            localStorage.removeItem('email');

            // navigation to home page
            go('/');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }


    // handle resend otp
    async function resendOtp() {
        try {
            const response = await api.post('api/auth/send-otp', { email });
            setIsResendOtp(true);
            setTimer(60);
            toast.success('otp sent to your email');
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


// timer function
    useEffect(() => {
        if (!isResendOtp) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    setIsResendOtp(false);
                    clearInterval(interval);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isResendOtp]);


    // loading page
    if (loading) {
            return (
                <Loading />
            )
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
                    <form onSubmit={handleVerifyEmail}>

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
                        {isResendOtp ?
                            // disabled button
                            <button
                                disabled
                                className='disabled-btn'
                                type='button'>resend otp
                            </button> :

                            // resend otp button
                            <button
                                className='resend-otp-btn'
                                onClick={resendOtp}
                                type="button">
                                resend otp
                            </button>}
                        {/* timer */}
                        {isResendOtp == true &&
                            <h6 style={{color: '#3b48fc'}}>{minutes.toString().padStart(2,'0')} : {seconds.toString().padStart(2,'0')}</h6>
                        }
                    </form>
                    <Link
                        className='already-haveAccount-link'
                        to={'/login'}>I already have an account</Link>
                </div>

            </div>
        </>
    )
}
