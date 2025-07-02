import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button";
import Modal from "../components/Modal";
import VerifyEmailModal from "../components/VerifyEmailModal";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const dropdownRef = useRef(null);

  // Show verify email modal if error message matches
  useEffect(() => {
    if (error && error.message && error.message.toLowerCase().includes("verify your email")) {
      setShowVerifyModal(true);
    } else {
      setShowVerifyModal(false);
    }
  }, [error]);

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
      <VerifyEmailModal
        open={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSubmit={() => setShowVerifyModal(false)}
      />
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <span
            className="font-medium text-gray-700 cursor-pointer"
            onClick={() => setDropdownOpen((open) => !open)}
            onMouseEnter={() => setDropdownOpen(true)}
          >
            {user?.name || user?.email || "User"}
          </span>
          {dropdownOpen && !showModal && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
              <Button
                variant="link"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline"
                onClick={() => {
                  setDropdownOpen(false);
                  window.location.href = '/profile';
                }}
              >
                Profile
              </Button>
              <Button
                variant="link"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline"
                onClick={() => {
                  setDropdownOpen(false);
                  setShowModal(true);
                }}
              >
                Logout
              </Button>
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
