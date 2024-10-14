'use client';

import React, { useState, createContext, useContext } from 'react';
import { ChevronFirst, ChevronLast, Home, Beer, MessageCircle, Award, Settings } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={`fixed top-0 left-0 z-40 h-full transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}>
      <nav className="h-full flex flex-col bg-gray-800 text-white shadow-lg">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"} font-bold`}>
            Bar Jumper
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, href }) {
  const { expanded } = useContext(SidebarContext);
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}
    `}>
      <Link href={href} className="flex items-center w-full">
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
          {text}
        </span>
      </Link>
      {!expanded && (
        <div className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-gray-100 text-gray-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}>
          {text}
        </div>
      )}
    </li>
  );
}

export function SidebarItems() {
  const items = [
    { icon: <Home size={20} />, text: "Home", href: "/" },
    { icon: <Beer size={20} />, text: "Bars", href: "/bars" },
    { icon: <MessageCircle size={20} />, text: "Chats", href: "/chats" },
    { icon: <Award size={20} />, text: "Rankings", href: "/rankings" },
    { icon: <Settings size={20} />, text: "Settings", href: "/settings" },
  ];

  return (
    <>
      {items.map((item, index) => (
        <SidebarItem key={index} icon={item.icon} text={item.text} href={item.href} />
      ))}
    </>
  );
}