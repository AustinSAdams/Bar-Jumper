import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { loginWithCredentials, CustomError } from '../../api/firebase/firebase';
import { X, CircleUser } from 'lucide-react';
import './Login.css';

const Login = ({ onClose, onSignupClick }) => {
    const [isLoginError, setIsLoginError] = useState('');
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

    // function to handle login logic upon click of login button
    const handleLogin = async () => {
        let emailInput = document.querySelector('.login-textbox[placeholder="EMAIL"]');
        let passwordInput = document.querySelector('.login-textbox[placeholder="PASSWORD"]');
        
        const email = emailInput.value;
        const password = await hash(passwordInput.value);
        
        if(email == '' || password == ''){
            setIsLoginError('Please fill in all fields.');
            return;
        }
        setIsLoginError('');
        try{
            await loginWithCredentials(email, password);
            emailInput.value = '';
            passwordInput.value = '';
            onClose();
        }catch (err) {
            if(err instanceof CustomError){
                setIsLoginError(err.message);
            }
            else{
                setIsLoginError("An unexpected error occurred.");
            }
        }
    };

    // LOGIC FOR "FORGOT PASSWORD" BUTTON
    const handleForgotPasswordClick = async () => {
         // FINISH LOGIC
    };

    const dismissPopup = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const loginLayout = (
        <div className="login" onClick={dismissPopup}>
            <div className="login-display">
                <button className="close-login-button" onClick={onClose}>
                    <X />
                </button>
                <div className="login-content">
                    <CircleUser className='login-picture' />
                    <div className="login-info">
                        <input type="email" className="login-textbox" placeholder="EMAIL" />
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
                        {isLoginError && <p className="error-message">{isLoginError}</p>}
                    </div>
                    <button 
                        className="login-button"
                        onClick={handleLogin}
                    >Login</button>
                </div>
                <button className="signup-btn" onClick={onSignupClick}>Signup</button>
                <button className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password</button>
            </div>
        </div>
    );

    // HTML code for the login page
    return createPortal(loginLayout, document.body);
};

export default Login;