import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';

function App() {

  return (
    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/category/:name" element={<CategoryPage />} />
    // </Routes>
    <div className='App'><Header /><LandingPage /><Footer /></div>
  );
}

export default App;
