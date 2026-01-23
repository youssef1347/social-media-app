import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Register } from './pages/Register/Register'

export const App = () => {
  return (
    

    // routes
    <Routes>
      <Route path='/' element={<h1 style={{color: 'red'}}>home page</h1>} /> 
      <Route path='/register' Component={Register} />
      <Route path='/login' element={<h1 style={{color: 'blue'}}>login page</h1>} />
    </Routes>
  )
}

export default App