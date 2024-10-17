import React from 'react';
import { Map, List, Search, User, MessageSquare } from 'lucide-react';
import './Navbar.css';

const NavBar = ({ theme, activeItem, onItemClick }) => {
  return (
    <nav className={`navbar ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="navbar-content">
        <NavItem icon={<Map size={24} />} label="Map" isActive={activeItem === 'map'} onClick={() => onItemClick('map')} />
        <NavItem icon={<Search size={24} />} label="Search" isActive={activeItem === 'search'} onClick={() => onItemClick('search')} />
        <NavItem 
          icon={<List size={24} />} 
          label="Bars" 
          isActive={activeItem === 'bars'}
          onClick={() => onItemClick('bars')} 
        />
        <NavItem icon={<MessageSquare size={24} />} label="Chat" isActive={activeItem === 'chat'} onClick={() => onItemClick('chat')} />
        <NavItem icon={<User size={24} />} label="Profile" isActive={activeItem === 'profile'} onClick={() => onItemClick('profile')} />
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