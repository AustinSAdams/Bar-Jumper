import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Login = ({ onClose }) => {
    const [isLoginError, setIsLoginError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // function to handle login logic upon click of login button
    const handleLogin = async () => {
        // Retrieve textbox references
        let passwordInput = document.querySelector('.login-textbox[placeholder="PASSWORD"]');
        let usernameInput = document.querySelector('.login-textbox[placeholder="USERNAME"]');
        // Retrieve values of textboxes
        const username = usernameInput.value;
        const password = await hash(passwordInput.value);
        //console.log(`USER: ${username}\nPASS: ${password}`);
        passwordInput.value = '';
        usernameInput.value = '';
        if(username == '' || password == ''){
            setIsLoginError(true);
            // LOGIN HAS EMPTY COMPONENTS.
            // logic needs completion
        } else {
            setIsLoginError(false);
            // LOGIN IS FILLED OUT.
            // logic needs completion
        }
    };

    // Function used to hash a string, then return it's hash
    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((bytes) => bytes.toString(16).padStart(2, '0'))
          .join('');
        return hashHex;
    }

    // LOGIC FOR SIGNUP BUTTON
    const handleSignupClick = async () => {
         // FINISH LOGIC
    }
    // LOGIC FOR "FORGOT PASSWORD" BUTTON
    const handleForgotPasswordClick = async () => {
         // FINISH LOGIC
    }

    // Function to dismiss the modal if clicked outside
    const dismissPopup = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const modalLayout = (
        <div className="login" onClick={dismissPopup}>
            <div className="login-display">
                <button className="close-login-button" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                <div className="login-content">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 40 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="login-picture"
                    >
                        <circle cx="20" cy="20" r="18" fill="lightgray" />
                        <path d="M20 24c-4 0-7-2-7-5s3-5 7-5 7 2 7 5-3 5-7 5z" />
                    </svg>
                    <div className="login-info">
                        <input type="username" className="login-textbox" placeholder="USERNAME" />
                        <div className="password-container">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="login-textbox" 
                                placeholder="PASSWORD" 
                            />
                            <button
                                className="toggle-password-button"
                                onClick={() => setShowPassword((prev)=>!prev)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {isLoginError && <p className="error-message">Please fill in all fields.</p>}
                    </div>
                    <button 
                        className="login-button"
                        onClick={handleLogin}
                    >Login</button>
                </div>
                <button className="signup-button" onClick={handleSignupClick}>Signup</button>
                <button className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password</button>
            </div>
        </div>
    );

    // HTML code for the login page
    return createPortal(modalLayout, document.body);
};

export default Login;