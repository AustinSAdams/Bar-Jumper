"use client";

// Import React hook for state management
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";
import { addFriend, logUserOut, removeFriend } from "../api/firebase/firebase"
import { CircleUser, UserPlus } from "lucide-react";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import FriendingPage from "./Friends/Friends";
import './Header.css';

// Define Header component
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const dropdownRef = useRef(null);

  const [headerLabel, setHeaderLabel] = useState("Bar Jumper");
  const [authView, setAuthView] = useState("none");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const dropDownOptions = [
    { label: "Home", className: "dropdown-item", onClick: () => {navigateTo("/")} },
    { label: "Settings", className: "dropdown-item", onClick: () => {navigateTo("/settings")} },
    { label: "Logout", className: "dropdown-logout", onClick: () => {onLogoutClick()} },
  ];

  useEffect(()=>{
    if(pathname == "/"){setHeaderLabel("Bar Jumper");}
    else if(pathname == "/chats"){setHeaderLabel("Chat");}
    else if(pathname == "/settings"){setHeaderLabel("Settings");}
    else{setHeaderLabel("Bar Jumper");}
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const navigateTo = (page) => {
    router.push(page);
  };

  const showLoginOverlay = () => setAuthView("login");
  const showSignupOverlay = () => setAuthView("signup");
  const hideAuthOverlay = () => setAuthView("none");

  const toggleFriendingPage = () => {
    if(authView === "friendingPage"){
      setAuthView("none");
    }
    else{
      setAuthView("friendingPage");
    }
  };

  const toggleDropdown = () => {
    setDropdownIsOpen((prev) => !prev);
  };

  const onLogoutClick = () => {
    logUserOut();
    setDropdownIsOpen(false);
  };

  return (
    <header className="header">
      {user ? (
        <span className="header-user-wrapper" onClick={toggleDropdown} ref={dropdownRef}>
          <img
            className="header-user-image"
            src={user.photoURL}
          />
          <p className="header-username">{user.displayName}</p>
          {dropdownIsOpen && (
            <div className="dropdown-menu">
              {dropDownOptions.map((option, index) => (
                <button key={index} onClick={option.onClick} className={option.className}>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </span>
      ) : (
        <button onClick={showLoginOverlay}>
          <CircleUser className="header-login-image"/>
        </button>
      )}
      <button
        className="header-title"
        onClick={() => router.push("/")}
      >{headerLabel}</button>

      {user && (
        <button onClick={toggleFriendingPage}>
          <UserPlus className="header-add-friend"/>
        </button>
      )}

      { authView === "login" && (
        <Login onClose={hideAuthOverlay} onSignupClick={showSignupOverlay} />
      )}
      { authView === "signup" && (
        <Signup onClose={hideAuthOverlay} onLoginClick={showLoginOverlay} />
      )}
      { authView === "friendingPage" && (
        <FriendingPage onClose={hideAuthOverlay}/>
      )}
    </header>
  );
};

// Export Header component
export default Header;
