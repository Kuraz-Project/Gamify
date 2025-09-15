import React from 'react'
import NavBar from '../Components/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout