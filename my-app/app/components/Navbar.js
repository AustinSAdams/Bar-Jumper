import React from 'react';
import { Home, Grid, Heart, User } from 'lucide-react';

const NavBar = ({ theme }) => {
  return (
    <nav className={`fixed -0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-t-xl shadow-lg`}>
      <div className="flex justify-around items-center h-16">
        <NavItem icon={<Home size={24} />} label="Home" theme={theme} />
        <NavItem icon={<Grid size={24} />} label="Store" theme={theme} />
        <NavItem icon={<Heart size={24} />} label="Wishlist" theme={theme} />
        <NavItem icon={<User size={24} />} label="Profile" theme={theme} />
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, theme }) => {
  return (
    <button className={`flex flex-col items-center justify-center ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default NavBar;