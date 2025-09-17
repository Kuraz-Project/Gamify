import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavBar = () => {
  const location = useLocation()

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  return (
    <nav className='flex justify-between items-center m-3 px-4 py-2 bg-white shadow-sm rounded-lg'>
        {/* Logo Section */}
        <div className='flex justify-between items-center gap-5'>
            <div className='w-16 h-16 flex justify-center items-center rounded-full border-2 bg-black text-white font-bold text-2xl font-poppins'>
                Q
            </div>
            <h2 className='text-3xl font-bold font-poppins text-gray-800'>
                Q and A App
            </h2>
        </div>

        {/* Navigation Links */}
        <div className='hidden md:block'>
            <ul className='flex justify-between items-center font-poppins text-lg gap-8'>
                <li>
                    <Link 
                        to="/" 
                        className={`transition-colors duration-200 hover:text-blue-600 ${
                            isActiveLink('/') ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/explore" 
                        className={`transition-colors duration-200 hover:text-blue-600 ${
                            isActiveLink('/explore') ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                    >
                        Explore Sessions
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/leader" 
                        className={`transition-colors duration-200 hover:text-blue-600 ${
                            isActiveLink('/leader') ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                    >
                        Leaderboards
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/create" 
                        className={`transition-colors duration-200 hover:text-blue-600 ${
                            isActiveLink('/create') ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                    >
                        Create
                    </Link>
                </li>
            </ul>
        </div>

        {/* User Actions */}
        <div className='flex justify-between items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-gray-200 flex justify-center items-center font-semibold text-gray-600'>
                P
            </div>
            <Link 
                to="/login" 
                className='font-poppins text-gray-700 hover:text-blue-600 transition-colors duration-200'
            >
                Login
            </Link>
            <Link 
                to="/register"
                className='bg-black text-white font-poppins rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors duration-200'
            >
                Get Started
            </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden p-2 text-gray-600 hover:text-gray-800'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
        </button>
    </nav>
  )
}

export default NavBar