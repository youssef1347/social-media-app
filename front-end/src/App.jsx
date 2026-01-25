import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Register } from './pages/Register/Register'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import { Login } from './pages/Login/Login'
import { VerifyEmail } from './pages/VerifyEmail/VerifyEmail'

export const App = () => {
  return (
    <>

      <ToastContainer position='top-left' />
      <Toaster />

    {/* routes */}
    <Routes>
      <Route path='/' element={<h1 style={{color: 'red'}}>home page</h1>} /> 
      <Route path='/register' Component={Register} />
      <Route path='/login' Component={Login} />
      <Route path='/verify-email' Component={VerifyEmail} />
      </Routes>

      </>
  )
}

export default App