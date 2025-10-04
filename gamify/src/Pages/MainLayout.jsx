import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import SideBar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import { Menu, X, Bell, Settings, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../App';

const MainLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSlimSidebar, setIsSlimSidebar] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSlimSidebar = () => {
    setIsSlimSidebar(!isSlimSidebar);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSettingsOpen(false); // Close settings if open
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsNotificationsOpen(false); // Close notifications if open
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {user ? (
        <>
          {/* Hamburger Menu Button for Mobile */}
          <button
            className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Dashboard Header for Authenticated Users */}
          <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <div className="flex items-center gap-3">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <Bell size={20} className="text-gray-600" />
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Notifications</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="p-2 hover:bg-gray-50 rounded">
                          New session starting soon: AI in Healthcare
                        </li>
                        <li className="p-2 hover:bg-gray-50 rounded">
                          You earned 50 points for participation!
                        </li>
                        <li className="p-2 hover:bg-gray-50 rounded">
                          Reminder: Complete your profile
                        </li>
                      </ul>
                    </div>
                  )}
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                  onClick={toggleSettings}
                  aria-label="Settings"
                >
                  <Settings size={20} className="text-gray-600" />
                  {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2 z-50">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Settings</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="p-2 hover:bg-gray-50 rounded">
                          Edit Profile
                        </li>
                        <li className="p-2 hover:bg-gray-50 rounded">
                          Change Password
                        </li>
                        <li className="p-2 hover:bg-gray-50 rounded">
                          Notification Preferences
                        </li>
                      </ul>
                    </div>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500">{user?.points?.toLocaleString() || 0} points</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* Sidebar */}
          <SideBar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isSlim={isSlimSidebar}
            toggleSlimSidebar={toggleSlimSidebar}
          />
          {/* Main Content */}
          <div className="flex-1 flex flex-col mt-14">
            <main className="flex-1 p-4 md:p-6 overflow-x-hidden">  {/* Added overflow-x-hidden */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <Outlet />
              </div>
            </main>
            <Footer isDashboard={true} />
          </div>
          {/* Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleSidebar}
            />
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col">
          <NavBar />
          <main className="flex-1 p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
