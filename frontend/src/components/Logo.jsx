// src/components/Header/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
      <Link to="/" className="flex items-center space-x-2">
        <img src="/logo.png" alt="Smiles First Logo" className="h-8 w-auto" />
      </Link>
    </div>
  );
}
