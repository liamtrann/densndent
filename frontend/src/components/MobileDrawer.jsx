// src/components/Header/MobileDrawer.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

export default function MobileDrawer({
  isOpen,
  onClose,
  categories,
  expandedMenus,
  toggleMenu
}) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 z-50`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b">
        <span className="text-lg font-bold">Menu</span>
        <FaTimes onClick={onClose} className="text-xl cursor-pointer" />
      </div>
      <nav className="flex flex-col px-6 py-4 space-y-2 text-gray-800 text-sm">
        <Link to="/" onClick={onClose}>Home</Link>

        <div>
          <button
            onClick={() => toggleMenu('Products')}
            className="flex items-center justify-between w-full py-2"
          >
            <span>Products</span>
            <span>{expandedMenus['Products'] ? '▲' : '▼'}</span>
          </button>
          {expandedMenus['Products'] && (
            <div className="ml-4 space-y-1">
              {categories.map(cat => (
                <div key={cat.name}>
                  <button
                    onClick={() => toggleMenu(cat.name)}
                    className="flex justify-between w-full text-left"
                  >
                    <span>{cat.name}</span>
                    <span>{expandedMenus[cat.name] ? '▲' : '▼'}</span>
                  </button>
                  {expandedMenus[cat.name] && (
                    <div className="ml-4 text-gray-600">
                      {cat.subcategories.map(sub => (
                        <Link
                          key={sub}
                          to={`/products/${cat.name.toLowerCase()}/${sub.toLowerCase()}`}
                          className="block py-1"
                          onClick={onClose}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/login" onClick={onClose} className="text-orange-600 font-semibold">
          Login
        </Link>
      </nav>
    </div>
  );
}
