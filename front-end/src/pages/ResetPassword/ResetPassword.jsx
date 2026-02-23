import React, { useRef, useState } from 'react'
import './ResetPassword.css'
import { IoIosArrowBack } from 'react-icons/io';
import { Inputs } from '../../components/Inputs/Inputs';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

export const ResetPassword = () => {

    // loading state
    const [loading, setLoading] = useState(false);

    // password ref
    const passwordRef = useRef();

    // error state
    const [errorMessage, setErrorMessage] = useState('');

    // navigation
    const navigate = useNavigate();
    function handleBack() {
        navigate(-1);
    }


    // submit function
    async function handleResetPassword(ev) {
        try {
            ev.preventDefault();
            setLoading(true);

            const password = passwordRef.current.value;

            if (!password) {
                setErrorMessage('password is required');
                return;
            } else if (password.length < 8) {
                setErrorMessage('password must be at least 8 charactars');
                return;
            }

            const response = await api.put('api/auth/reset-password', { newPassword: password });
            console.log(response);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reset-password-page-container">
            {/* back icon container */}
            <div className="reset-password-back-icon-container">
                <IoIosArrowBack
                onClick={handleBack}
                className="reset-password-back-icon"
                />
            </div>
            {/* text container */}
            <div className="reset-password-text-container">
                <h2>Reset your password</h2>
                <p>Create a password with at least 8 letters and numbers. You’ll need this password <br /> to log into your account.</p>
            </div>

            <form
                onSubmit={handleResetPassword}
                className="reset-password-form">
                {/* input */}
                <div className="reset-password-input-container">
                <Inputs
                    type="password"
                    id="password"
                    labelValue="password"
                    name="password"
                    inputRef={passwordRef}
                    errorMessage={errorMessage}
                />
                </div>

                {/* continue button */}
                <button
                disabled={loading}
                className="reset-password-btn"
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
}
