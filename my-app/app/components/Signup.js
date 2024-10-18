import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createAccount, CustomError } from '../api/firebase/firebase';
import { X } from 'lucide-react';
import './Signup.css';

const Signup = ({ onClose, onLoginClick }) => {
    const [isSignupError, setIsSignupError] = useState('');
    const [currentUser, setCurrentUser] = useState();
    const [showPassword, setShowPassword] = useState(false);


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
        let usernameInput = document.querySelector('.signup-textbox[placeholder="USERNAME"]');
        let emailInput = document.querySelector('.signup-textbox[placeholder="EMAIL"]');
        let passwordInput = document.querySelector('.signup-textbox[placeholder="PASSWORD"]');

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = await hash(passwordInput.value);
        try{
            const user = await createAccount(email, password, username);
            onClose();
        }catch(err) {
            if(err instanceof CustomError){
                setIsSignupError(err.message);
            }
            else{
                setIsSignupError("An unexpected error");
            }
        }
    };

    // Function to dismiss the modal if clicked outside
    const dismissPopup = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const signupLayout = (
        <div className="signup" onClick={dismissPopup}>
            <div className="signup-display">
                <button className="close-signup-button" onClick={onClose}>
                    <X />
                </button>
                <div className="signup-content">                    
                    <div className="signup-info">
                        <input type="username" className="signup-textbox" placeholder="USERNAME" />
                        <div className="password-container">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="signup-textbox" 
                                placeholder="PASSWORD" 
                            />
                            <button
                                className="toggle-password-button"
                                onClick={() => setShowPassword((prev)=>!prev)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <input type="email" className="signup-textbox" placeholder="EMAIL" />
                        {isSignupError && <p className="error-message">{isSignupError}</p>}
                    </div>
                    <button 
                        className="signup-button"
                        onClick={handleSignupClick}
                    >Signup</button>
                </div>
                <button className="login-return-button" onClick={onLoginClick}>Back To Login</button>
            </div>
        </div>
    );

    return createPortal(signupLayout, document.body);
};

export default Signup;