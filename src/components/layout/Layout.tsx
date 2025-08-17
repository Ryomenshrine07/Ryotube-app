import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true); 
    } else {
      setIsSidebarOpen(false); 
    }
  })

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // md:ml-60 mb-16 md:mb-0
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onMenuToggle={toggleSidebar} isMenuOpen={isSidebarOpen} />
      {window.innerWidth >= 768 && <Sidebar isOpen={isSidebarOpen} />}
      <main
          className={`
            transition-all duration-300 ease-in-out
            pb-16 md:pb-0
            ml-0 mt-16 
            md:ml-[240px] md:mt-[64px]
            ${!isSidebarOpen ? 'md:ml-[72px]' : ''}
          `}
        >
          <Outlet />
        </main>
      <MobileBottomNav />
    </div>
  );
};

export default Layout;