import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Crown, User, Users, Wallet, LogOut } from "lucide-react";
import { useAuth } from '../App';  // Adjust path if needed

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const toHome = () => {
        navigate("/");
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className='sticky top-0 left-0 z-50 flex flex-col h-screen w-64 bg-white shadow-md px-4 py-6'>
            {/* Logo Section */}
            <div className='flex flex-col items-center gap-3 mb-8 cursor-pointer' onClick={toHome}>
                <div className='w-16 h-16 flex justify-center items-center rounded-full border-2 bg-black text-white font-bold text-2xl font-poppins'>
                    Q
                </div>
                <h2 className='text-2xl font-bold font-poppins text-gray-800'>
                    Gamify
                </h2>
            </div>

            {/* Navigation Links */}
            <ul className='flex flex-col gap-4 font-poppins text-lg'>
                <li>
                    <Link 
                    to="/" 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 ${isActiveLink('/') ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    >
                    <Home size={18} />
                    <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link 
                    to="/explore" 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 ${isActiveLink('/explore') ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    >
                    <Compass size={18} />
                    <span>Explore Sessions</span>
                    </Link>
                </li>
                <li>
                    <Link 
                    to="/leaderboards" 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 ${isActiveLink('/leaderboards') ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    >
                    <Crown size={18} />
                    <span>Leaderboards</span>
                    </Link>
                </li>
                <li>
                    <Link 
                    to="/create" 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 ${isActiveLink('/create') ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    >
                    <Users size={18} />
                    <span>Create</span>
                    </Link>
                </li>
                <li>
                    <Link 
                    to="/profile" 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 ${isActiveLink('/profile') ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    >
                    <User size={18} />
                    <span>Profile</span>
                    </Link>
                </li>
                <li>
                    <Link 
                    to="/wallet" 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 ${isActiveLink('/wallet') ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'}`}
                    >
                    <Wallet size={18} />
                    <span>Wallet</span>
                    </Link>
                </li>
            </ul>

            {/* Logout */}
            <div className='mt-auto'>
                <button 
                onClick={handleLogout}
                className='flex items-center gap-2 p-2 w-full rounded-md transition-colors duration-200 hover:bg-red-100 hover:text-red-600 text-gray-700'
                >
                <LogOut size={18} />
                <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SideBar;