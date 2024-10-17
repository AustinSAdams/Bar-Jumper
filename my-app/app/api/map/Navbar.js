import React from 'react';
import { Map, List, Search, User, MessageSquare } from 'lucide-react';
import './Navbar.css';

const NavBar = ({ theme }) => {
  return (
    <nav className={`navbar ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="navbar-content">
        <NavItem icon={<Map size={24} />} label="Map" />
        <NavItem icon={<Search size={24} />} label="Search" />
        <NavItem icon={<List size={24} />} label="Bars" />
        <NavItem icon={<MessageSquare size={24} />} label="Chat" />
        <NavItem icon={<User size={24} />} label="Profile" />
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label }) => {
  return (
    <button className="nav-item">
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default NavBar;