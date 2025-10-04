import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Compass, 
    Crown, 
    User, 
    Wallet, 
    LogOut, 
    PlusCircle, 
    BarChart3, 
    Video, 
    PanelLeftClose, 
    PanelLeftOpen 
} from 'lucide-react';
import { useAuth } from '../App';

const SideBar = ({ isOpen, toggleSidebar, isSlim, toggleSlimSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const { logout } = auth || {};
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showLogoutDialog) {
                setShowLogoutDialog(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showLogoutDialog]);

    const toHome = () => {
        navigate('/');
        toggleSidebar();
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        if (logout) {
            logout();
            navigate('/');
            toggleSidebar();
        }
        setShowLogoutDialog(false);
    };

    const cancelLogout = () => {
        setShowLogoutDialog(false);
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/explore', icon: Compass, label: 'Explore Sessions' },
        { path: '/leaderboards', icon: Crown, label: 'Leaderboards' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/wallet', icon: Wallet, label: 'Wallet' },
        { path: '/my-sessions', icon: Video, label: 'My Sessions' },
        { path: '/create', icon: PlusCircle, label: 'Create Session' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <>
            <aside
                className={`flex flex-col justify-between sticky top-14 h-[calc(100vh-3.5rem)] ${
                    isSlim ? 'w-16' : 'w-[300px]'
                } bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 shadow-lg px-2 py-6 transition-all duration-300 ease-in-out md:translate-x-0 border-r border-gray-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-6 mb-8 px-2">
                    <div className="flex items-center cursor-pointer" onClick={toHome}>
                        <div
                            className={`w-10 h-10 flex justify-center items-center rounded-full bg-gray-800 text-white font-bold text-lg font-poppins ${
                                isSlim ? 'mx-auto' : ''
                            }`}
                        >
                            Q
                        </div>
                        {!isSlim && (
                            <h2 className="text-xl font-bold font-poppins text-gray-900 pl-2">Gamify</h2>
                        )}
                    </div>
                    <button
                        onClick={toggleSlimSidebar}
                        className="p-1 rounded-full hover:bg-gray-300"
                        aria-label={isSlim ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={isSlim ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSlim ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1">
                    <ul className="flex flex-col gap-2 font-poppins text-base">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-300 ${
                                            isActiveLink(item.path)
                                                ? 'bg-gray-800 text-white font-semibold'
                                                : 'text-gray-700 hover:text-gray-900'
                                        } ${isSlim ? 'justify-center px-1' : ''}`}
                                        onClick={toggleSidebar}
                                        title={isSlim ? item.label : ''}
                                    >
                                        <Icon size={isSlim ? 20 : 24} />
                                        {!isSlim && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Divider and Logout */}
                <div className="border-t border-gray-300">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-700 hover:border hover:rounded-xl text-gray-700 ${
                            isSlim ? 'justify-center px-1' : ''
                        }`}
                        title={isSlim ? 'Logout' : ''}
                    >
                        <LogOut size={isSlim ? 20 : 24} />
                        {!isSlim && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Dialog as Portal */}
            {showLogoutDialog &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
                        onClick={cancelLogout}
                    >
                        <div
                            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Logout</h3>
                            <p className="mb-6 text-gray-700">Are you sure you want to logout?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelLogout}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default SideBar;