import React from 'react';
import { Home, Beer, MessageCircle, Award } from 'lucide-react';

const Sidebar = ({ isOpen, closeMenu }) => {
  // List of buttons and references to be added to menu.
  const sidebarItems = [
    { href: "./", label: "Home", icon: Home },
    { href: "./bars", label: "Bars", icon: Beer },
    { href: "./chats", label: "Chats", icon: MessageCircle },
    { href: "./rankings", label: "Rankings", icon: Award },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="close-button" onClick={closeMenu}>
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
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <button 
                className="sidebar-button flex items-center" 
                onClick={() => window.location.href = item.href}
              >
                <item.icon className="mr-2" size={20} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;