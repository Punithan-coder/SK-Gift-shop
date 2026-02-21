import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {  BrowserRouter,Routes, Route } from "react-router-dom";
import Cart from './components/Cart/Cart';
import Homepage from './components/Homepage/Homepage';  
import Contactpage from './components/Contactpage/Contactpage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contactpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
