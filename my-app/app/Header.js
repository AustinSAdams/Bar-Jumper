"use client";

// Import React hook for state management
import { useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";

// Define Header component
const Header = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [loginIsShown, setLoginIsShown] = useState(false);

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setSidebarIsOpen(!sidebarIsOpen);
    
  };
  const closeMenu = () => {
    setSidebarIsOpen(false);
  };

  const showLoginOverlay = () => {
    setLoginIsShown(true);
  };

  const hideLoginOverlay = () => {
    setLoginIsShown(false);
  }

  return (
    <header className="header">
      <button className="header-left-button" onClick={toggleMenu}>
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
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="header-center-button">
        <a href="./">
          <button>Bar Jumper</button>
        </a>
      </div>
      <div className="header-right-button">
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
      </div>
      { sidebarIsOpen && (
        <Sidebar isOpen={sidebarIsOpen} closeMenu={closeMenu} />
      )}
      { loginIsShown && (
        <Login onClose={() => setLoginIsShown(false)}/>
      )}

    </header>
  );
};

// Export Header component
export default Header;
