import React from 'react'

const NavBar = () => {
  return (
    <div className='flex justify-between items-center m-3'>
        <div className='flex justify-between items-center gap-5'>
            <div className='w-16 h-16 flex justify-center items-center rounded-full font poppins border bg-black text-white font-bold text-2xl'>
                Q
            </div>
            <h2 className='text-3xl font-bold font-poppins'>
                Q and A App
            </h2>
        </div>

        <div>
            <ul className='flex justify-between items-center font-poppins text-xl gap-5 text-gray-700'>
                <li>
                    <div>
                        
                    </div>
                    Home
                </li>
                <li>
                    Explore Sessions
                </li>
                <li>
                    Leaderboards
                </li>
                <li>
                    Creators Profiles
                </li>
            </ul>
        </div>

        <div className='flex justify-between items-center gap-5'>
            <div className='w-12 h-12 rounded-full bg-gray-200 text-bold flex justify-center items-center'>
                P
            </div>
            <a href="/">Login</a>
            <button className='bg-black text-white font-poppins rounded-lg px-3 py-2'>
                Get Started
            </button>
            
        </div>

    </div>
  )
}

export default NavBar