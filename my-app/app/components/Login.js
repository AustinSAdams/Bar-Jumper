const Login = ({ onClose }) => {
    return (
        <div className="login">
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
                        <input type="text" className="login-textbox" placeholder="EMAIL" />
                        <input type="text" className="login-textbox" placeholder="PASSWORD" />
                    </div>
                    <button 
                        className="login-button"
                        onClick={() => {console.log("hello")}} /* Login logic should be implemented into a function that goes through here */
                    >Login</button>
                </div>
            </div>
        </div>
    );
};

export default Login;