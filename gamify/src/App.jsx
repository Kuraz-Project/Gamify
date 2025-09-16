import React from 'react'
import {Route, createBrowserRouter, RouterProvider, createRoutesFromElements} from 'react-router-dom'
import MainLayout from './Pages/MainLayout'
import Home from './Pages/Home'
import Explore from './Pages/Explore'
import Leader from './Pages/Leader'
import Create from './Pages/Create'
import Error from './Pages/Error'
import RegisterationPage from './Pages/Register'
import Login from './Pages/Login'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<MainLayout />}>
      <Route index element={<Home />}/> 
      <Route path='explore' element={<Explore />}/>
      <Route path='leader' element={<Leader />}/>
      <Route path='create' element={<Create />}/>
      <Route path='register' element={<RegisterationPage />}/>
      <Route path='login' element={<Login />}/>
      <Route path="*" element={<Error />}/>
    </Route>
  )
)

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App