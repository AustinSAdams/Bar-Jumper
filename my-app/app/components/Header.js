"use client";

// Import React hook for state management
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { logUserOut } from "../api/firebase/firebase"
import Login from "./Login";
import Signup from "./Signup";
import './Header.css';

// Define Header component
const Header = () => {
  const router = useRouter();
  const user = useUser();
  const dropdownRef = useRef(null);
  const [authView, setAuthView] = useState("none");
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const dropDownOptions = [
    { label: "Home", className: "dropdown-item", onClick: () => {navigateTo("/")} },
    { label: "Settings", className: "dropdown-item", onClick: () => {navigateTo("settings")} },
    { label: "Logout", className: "dropdown-logout", onClick: () => {onLogoutClick()} },
  ];

  useEffect(()=>{
    if(user !== null){
      setUserIsLoggedIn(true);
    }
    else{
      setUserIsLoggedIn(false);
    }
  },[user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showLoginOverlay = () => setAuthView("login");
  const showSignupOverlay = () => setAuthView("signup");
  const hideAuthOverlay = () => setAuthView("none");

  const toggleDropdown = () => setDropdownIsOpen((prev) => !prev);

  const onLogoutClick = () => {
    setUserIsLoggedIn(!userIsLoggedIn);
    logUserOut();
  };

  const navigateTo = (page) => {
    router.push(page);
    toggleDropdown();
  };

  return (
    <header className="header">
      <span className="header-center-wrapper">
        <button
          className="header-center-button"
          onClick={() => router.push("/")}
        >Bar Jumper</button>
      </span>
      <span className="header-right-button" onClick={toggleDropdown}>
        {userIsLoggedIn ? (
          <span className="header-user-wrapper">
            <p className="header-username">{user.displayName}</p>
            <img
              className="header-user-image"
              src={user.photoURL}
            />
          </span>
        ) : (
          <button onClick={showLoginOverlay}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="20" cy="20" r="18" fill="lightgray" />
              <path d="M20 24c-4 0-7-2-7-5s3-5 7-5 7 2 7 5-3 5-7 5z" />
            </svg>
          </button>
        )}
      </span>
      
      {userIsLoggedIn && dropdownIsOpen && (
        <div className="dropdown-menu" ref={dropdownRef}>
          {dropDownOptions.map((option, index) => (
            <button key={index} onClick={option.onClick} className={option.className}>
              {option.label}
            </button>
          ))}
        </div>
      )}
      { authView === "login" && (
        <Login onClose={hideAuthOverlay} onSignupClick={showSignupOverlay} />
      )}
      { authView === "signup" && (
        <Signup onClose={hideAuthOverlay} onLoginClick={showLoginOverlay} />
      )}
    </header>
  );
};

// Export Header component
export default Header;
