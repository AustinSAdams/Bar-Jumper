import React from 'react';
import Link from 'next/link';
import { Map, List, Search, User, MessageSquare } from 'lucide-react';
import './Navbar.css';

const NavBar = ({ theme, activeItem, onItemClick }) => {
  return (
    <nav className={`navbar ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="navbar-content">
        <NavItem icon={<Map size={24} />} label="Map" isActive={activeItem === 'map'} onClick={() => onItemClick('map')} />
        {/* <NavItem icon={<Search size={24} />} label="Search" isActive={activeItem === 'search'} onClick={() => onItemClick('search')} /> */}
        <NavItem
          icon={<List size={24} />}
          label="Bars"
          isActive={activeItem === 'bars'}
          onClick={() => onItemClick('bars')}
        />
        <Link href="/chats" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`nav-item ${activeItem === 'chat' ? 'active' : ''}`}>
            <MessageSquare size={24} />
            <span>Chat</span>
          </div>
        </Link>
        <Link href="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`nav-item ${activeItem === 'profile' ? 'active' : ''}`}>
            <User size={24} />
            <span>Profile</span>
          </div>
        </Link>
      </div>
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
