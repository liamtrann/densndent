import React, { useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button";
import Modal from "../components/Modal";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (isLoading) return null;

  return (
    <>
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <span
            className="font-medium text-gray-700 cursor-pointer"
            onClick={() => setDropdownOpen((open) => !open)}
            onMouseEnter={() => setDropdownOpen(true)}
          >
            {user?.name}
          </span>
          {dropdownOpen && !showModal && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  setShowModal(true);
                }}
              >
                Logout
              </button>
            </div>
          )}

          {/* Modal for logout confirmation using Modal.jsx */}
          {showModal && (
            <Modal
              title="Confirm Logout"
              onClose={() => setShowModal(false)}
              image={null}
              onSubmit={() => {
                setShowModal(false);
                logout({ returnTo: window.location.origin });
              }}
              onCloseText="Cancel"
              onSubmitText="Logout"
            />
          )}
        </div>
      ) : (
        <Button variant="link" onClick={() => loginWithRedirect({ screen_hint: "login" })}>
          Login
        </Button>
      )}
    </>
  );
}
