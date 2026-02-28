import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register/Register';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login/Login';
import { VerifyEmail } from './pages/VerifyEmail/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from './pages/Home/Home';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { Profile } from './pages/Profile/Profile';

export const App = () => {
  return (
    <>

      <ToastContainer position='top-left' />
      <Toaster />

    {/* auth pages routes */}

    <Routes>
      <Route path='/' Component={Home} />
      <Route path='/register' Component={Register} />
      <Route path='/login' Component={Login} />
      <Route path='/verify-email' Component={VerifyEmail} />
      <Route path='/forgot-password' Component={ForgotPassword} />
      <Route path='/reset-password' Component={ResetPassword} />
      <Route path='/profile/:id' Component={Profile} />
    </Routes>

      </>
  )
}

export default App