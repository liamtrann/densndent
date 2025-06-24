import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Smiles First Logo" className="h-8" />
        <span className="text-orange-700 font-semibold text-xl">Dens 'n Dente USA</span>
      </div>
      <input
        type="text"
        placeholder="Search dental products..."
        className="flex-1 mx-6 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <div className="flex items-center gap-4">
        <button className="text-orange-600 hover:underline">Login</button>
        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Create Account</button>
      </div>
    </header>
  );
}
