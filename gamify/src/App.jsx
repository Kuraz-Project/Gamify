import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'
import {Route, createBrowserRouter, RouterProvider, createRoutesFromElements} from 'react-router-dom'
import MainLayout from './Pages/MainLayout'
import Home from './Pages/Home'
import Explore from './Pages/Explore'
import Leader from './Pages/Leader'
import Create from './Pages/Create'
import Error from './Pages/Error'
import RegisterationPage from './Pages/Register'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Wallet from './Pages/Wallet'
import Leaderboards from './Pages/Leaderboards'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [])

  const login = (nextUser) => {
    setUser(nextUser)
    try { localStorage.setItem('user', JSON.stringify(nextUser)) } catch {}
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem('user') } catch {}
  }

  const updateUser = (updater) => {
    setUser((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      try { localStorage.setItem('user', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout, updateUser }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<MainLayout />}>
      <Route index element={<Home />}/> 
      <Route path='explore' element={<Explore />}/>
      <Route path='leader' element={<Leaderboards />}/>
      <Route path='leaderboards' element={<Leaderboards />}/>
      <Route path='profile' element={<Profile />}/>
      <Route path='wallet' element={<Wallet />}/>
      <Route path='create' element={<Create />}/>
      <Route path='register' element={<RegisterationPage />}/>
      <Route path='login' element={<Login />}/>
      <Route path="*" element={<Error />}/>
    </Route>
  )
)

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App