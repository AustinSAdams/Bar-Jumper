import React, { useState } from 'react';
import Link from 'next/link';
import { Map, List, MessageSquare, User } from 'lucide-react';
import './Navbar.css';
import ProfilePopup from './ProfilePopup';
import { useUser } from '@/app/context/UserContext';

const NavBar = ({ theme, activeItem, onItemClick }) => {
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const user = useUser();

    const handleProfileClick = () => {
        if (user) {
            setShowProfilePopup(!showProfilePopup);
            onItemClick('profile');
        } else {
            alert('Please sign in to view profile.');
        }
    };

    const handleNavItemClick = (item) => {
        setShowProfilePopup(false);
        onItemClick(item);
    };

    return (
        <nav className={`navbar ${theme === 'dark' ? 'dark-mode' : ''}`}>
            <div className="navbar-content">
                <NavItem icon={<Map size={24} />} label="Map" isActive={activeItem === 'map'} onClick={() => handleNavItemClick('map')} />
                <NavItem icon={<List size={24} />} label="Bars" isActive={activeItem === 'bars'} onClick={() => handleNavItemClick('bars')} />
                
                <Link href="/chats" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={`nav-item ${activeItem === 'chat' ? 'active' : ''}`} onClick={() => handleNavItemClick('chat')}>
                        <MessageSquare size={24} />
                        <span>Chat</span>
                    </div>
                </Link>

                <div onClick={handleProfileClick} className={`nav-item ${activeItem === 'profile' ? 'active' : ''}`}>
                    <User size={24} />
                    <span>Profile</span>
                </div>
            </div>

            {showProfilePopup && <ProfilePopup onClose={() => setShowProfilePopup(false)} />}
        </nav>
    );
};

const NavItem = ({ icon, label, isActive, onClick }) => {
    return (
        <button className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default NavBar;
