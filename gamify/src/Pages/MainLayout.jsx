import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import SideBar from '../Components/SideBar'; 
import Footer from '../Components/Footer';
import { useAuth } from '../App';  

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {user ? (
        <>
          <SideBar />
          <div className="flex-1 flex flex-col">
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col">
          <NavBar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;