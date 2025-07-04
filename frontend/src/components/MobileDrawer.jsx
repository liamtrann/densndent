// src/components/MobileDrawer.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';

function MobileDrawer({
  isOpen,
  onClose,
  categories,
  expandedMenus,
  toggleMenu
}) {
  const ref = useRef();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

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

        {/* Products Dropdown */}
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
                      {cat.subcategories.map(sub => {
                        const name = (sub.name || '').replace(/\s+/g, '');
                        const id = sub.id || '';
                        return (
                          <Link
                            key={name + (id ? `-${id}` : '')}
                            to={id ? `/products/${name.toLowerCase()}-${id}` : `/products/${name.toLowerCase()}`}
                            className="block py-1"
                            onClick={onClose}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Static Links */}
        <Link to="/promotions" onClick={onClose}>Promotions & Catalogues</Link>
        <Link to="/clearance" onClick={onClose}>Clearance</Link>
        <Link to="/partners" onClick={onClose}>Our Partners</Link>
        <Link to="/about" onClick={onClose}>About Us</Link>

        {/* Auth Section */}
        {!isAuthenticated ? (
          <button
            onClick={() => {
              loginWithRedirect();
              onClose();
            }}
            className="text-left text-orange-600 font-semibold"
          >
            Login
          </button>
        ) : (
          <div className="pt-2">
            <p className="text-sm text-gray-700 mb-1">Signed in as</p>
            <p className="text-sm font-semibold text-black mb-2">{user?.name}</p>
            <button
              onClick={() => {
                logout({ returnTo: window.location.origin });
                onClose();
              }}
              className="text-left text-red-600 text-sm"
            >
              Log out
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default MobileDrawer;
