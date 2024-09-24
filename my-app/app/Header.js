"use client";

// Import React hook for state management
import { useState } from "react";

// Define Header component
const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu open/close

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <button className="left-button" onClick={toggleMenu}>
        {isOpen ? (
          // Render close icon when menu is open
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
        ) : (
          // Render hamburger icon when menu is closed
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
        )}
      </button>
      <div className="center-button">
        <button>Bar Jumper</button>
      </div>
      <button className="right-button">
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
    </header>
  );
};

// Export Header component
export default Header;
