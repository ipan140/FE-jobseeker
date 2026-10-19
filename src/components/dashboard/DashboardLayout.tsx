import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import DashboardMatrix from './DashboardMatrix';

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePath, setActivePath] = useState('/dashboard');

  // Handle responsive collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activePath={activePath}
        onNavigate={(path) => setActivePath(path)}
      />

      {/* Main Column Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-[72px]' : 'pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          title="Dashboard Monitoring Karir & Rekrutmen"
        />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <DashboardMatrix />
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
}
