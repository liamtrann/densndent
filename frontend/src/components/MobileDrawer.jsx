// src/components/MobileDrawer.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import Paragraph from '../common/Paragraph';
import Button from '../common/Button';

const promotionsLinks = [
  { label: "JDIQ Raffle Winners", path: "/promotions/jdiq" },
  { label: "Monthly Specials", path: "/promotions/monthly" },
  { label: "Q3 D2 Specials (House Brand)", path: "/promotions/q3-d2" },
  { label: "Q3 Vendor Specials", path: "/promotions/q3-vendor" },
  { label: "Q3 Catalogue", path: "/promotions/q3-catalogue" },
  { label: "DND Gift Card Program", path: "/promotions/gift-card" }
];

const aboutLinks = [
  { label: "About Us", path: "/about" },
  { label: "Meet Our Team", path: "/team" },
  { label: "FAQs", path: "/faq" }, // ✅ Correct route
  { label: "Contact Us", path: "/contact" },
  { label: "Blog", path: "/blog" }
];


function MobileDrawer({
  isOpen,
  onClose,
  categories,
  expandedMenus,
  toggleMenu
}) {
  const ref = useRef();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const isExpanded = (key) => expandedMenus[key];
  const toggle = (key) => toggleMenu(key);

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

      <nav className="flex flex-col px-6 py-4 space-y-2 text-sm text-gray-800">
        <Link to="/" onClick={onClose}>Home</Link>

        {/* Products Dropdown */}
        <div>
          <Button
            variant="link"
            onClick={() => toggle('Products')}
            className="flex items-center justify-between w-full py-2"
          >
            <span>Products</span>
            <span>{isExpanded('Products') ? '▲' : '▼'}</span>
          </Button>
          {isExpanded('Products') && (
            <div className="ml-4 space-y-1">
              {categories.map(cat => (
                <div key={cat.name}>
                  <Button
                    variant="link"
                    onClick={() => toggle(cat.name)}
                    className="flex justify-between w-full text-left"
                  >
                    <span>{cat.name}</span>
                    <span>{isExpanded(cat.name) ? '▲' : '▼'}</span>
                  </Button>
                  {isExpanded(cat.name) && (
                    <div className="ml-4 text-gray-600">
                      {cat.subcategories.map(sub => {
                        const name = (sub.name || '').replace(/\s+/g, '');
                        const id = sub.id || '';
                        return (
                          <Link
                            key={name + id}
                            to={id ? `/products/by-class/${name.toLowerCase()}-${id}` : `/products/by-class/${name.toLowerCase()}`}
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

        {/* Promotions Dropdown */}
        <div>
          <Button
            variant="link"
            onClick={() => toggle('Promotions')}
            className="flex items-center justify-between w-full py-2"
          >
            <span>Promotions & Catalogues</span>
            <span>{isExpanded('Promotions') ? '▲' : '▼'}</span>
          </Button>
          {isExpanded('Promotions') && (
            <div className="ml-4 space-y-1 text-orange-600 font-semibold">
              <span>BROWSE PROMOTIONS & CATALOGUES</span>
              {promotionsLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Clearance & Partners */}
        <Link to="/clearance" onClick={onClose}>Clearance</Link>
        <Link to="/partners" onClick={onClose}>Our Partners</Link>

        {/* About Us Dropdown */}
        <div>
          <Button
            variant="link"
            onClick={() => toggle('About')}
            className="flex items-center justify-between w-full py-2"
          >
            <span>About Us</span>
            <span>{isExpanded('About') ? '▲' : '▼'}</span>
          </Button>
          {isExpanded('About') && (
            <div className="ml-4 space-y-1 text-orange-600 font-semibold">
              <span>BROWSE ABOUT US</span>
              {aboutLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Auth Section */}
        {!isAuthenticated ? (
          <div className="pt-4">
            <Button
              variant="link"
              onClick={() => {
                loginWithRedirect();
                onClose();
              }}
              className="text-left text-orange-600 font-semibold"
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="pt-2">
            <Paragraph className="text-sm text-gray-700 mb-1">Signed in as</Paragraph>
            <Link
              to="/profile"
              onClick={onClose}
              className="text-sm font-semibold text-black hover:underline mb-2 block"
            >
              {user?.name}
            </Link>
            <Button
              variant="link"
              onClick={() => {
                logout({ returnTo: window.location.origin });
                onClose();
              }}
              className="text-left text-red-600 text-sm"
            >
              Log out
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default MobileDrawer;
