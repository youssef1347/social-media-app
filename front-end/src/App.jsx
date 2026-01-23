import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Register } from './pages/Register/Register'

export const App = () => {
  return (
    

    // routes
    <Routes>
      <Route path='/' element={<h1>home page</h1>} /> 
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default App