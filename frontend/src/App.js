import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:name" element={<CategoryPage />} />
    </Routes>

  );
}

export default App;
