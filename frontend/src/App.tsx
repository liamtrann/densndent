import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 text-white p-6">
      <h1 className="text-5xl font-extrabold mb-4">
        Tailwind CSS is Working!
      </h1>
      <button className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-100 transition">
        Click Me
      </button>
      <p className="mt-6 text-lg max-w-md text-center">
        If you see this styled properly with blue to purple gradient background and a styled button, Tailwind CSS is set up correctly.
      </p>
    </div>
  );
}

export default App
