import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createAccount } from '../api/firebase/firebase';

const Signup = ({ onClose, onLoginClick }) => {
    const [isSignupError, setIsSignupError] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [isSignedUp, setIsSignedUp] = useState(false);

    // Function used to hash a string, then return it's hash
    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((bytes) => bytes.toString(16).padStart(2, '0'))
          .join('');
        return hashHex;
    };

    const handleSignupClick = async () => {
        let usernameInput = document.querySelector('.login-textbox[placeholder="USERNAME"]');
        let emailInput = document.querySelector('.login-textbox[placeholder="EMAIL"]');
        let passwordInput = document.querySelector('.login-textbox[placeholder="PASSWORD"]');

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = await hash(passwordInput.value);
        
        const user = await createAccount(email, password, username);
        setCurrentUser(user);
    };

    // Function to dismiss the modal if clicked outside
    const dismissPopup = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const signupLayout = (
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
                        <input type="email" className="login-textbox" placeholder="EMAIL" />
                        <input type="password" className="login-textbox" placeholder="PASSWORD" />
                    </div>
                    <button 
                        className="login-button"
                        onClick={handleSignupClick}
                    >Signup</button>
                </div>
                <button className="signup-button" onClick={onLoginClick}>Back to Login</button>
            </div>
        </div>
    );

    return createPortal(signupLayout, document.body);
};

export default Signup;