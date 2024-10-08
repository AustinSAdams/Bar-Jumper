const Sidebar = ({ isOpen, closeMenu }) => {
  // List of buttons and references to be added to menu.
  const sidebarItems = [
    { href: "./", label: "Home" },
    { href: "./bars", label: "Bars" },
    { href: "./chats", label: "Chats" },
    { href: "./rankings", label: "Rankings" },
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
              <button className="sidebar-button" onClick={() => window.location.href = item.href}>
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
