import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NotFound404 from './pages/NotFound404'
import CreateAdPage from './pages/CreateAdPage'
import EditAdPage from './pages/EditAdPage'
import WishlistPage from './pages/WishlistPage'
import MainLayout from './layout/MainLayout'


const App = () => {
  return (
    <Routes>
      <Route path ='/' element={<MainLayout/>}>
<Route path = '/' element={<HomePage/>}/> 
<Route path = '/register' element={<RegisterPage/>}/>
<Route path = '/Login' element={<LoginPage/>}/>
<Route path = '/Profile' element={<ProfilePage/>}/>
<Route path = '*' element={<NotFound404/>}/>
</Route>
    </Routes>
  )
}

export default App