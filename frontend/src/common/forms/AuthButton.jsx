import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Toast from "../toast/Toast";
import { Modal } from "components";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } =
    useAuth0();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Show toast for email verification and logout
  useEffect(() => {
    if (error?.message?.toLowerCase().includes("verify your email")) {
      Toast.error(
        "Please verify your email address to continue. Check your inbox for a verification link."
      );
      // Wait for toast to be visible before logging out
      setTimeout(() => {
        logout({ returnTo: window.location.origin });
      }, 5000); 
    }
  }, [error, logout]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
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
            {user?.name || user?.email || "User"}
          </span>

          {/* Dropdown */}
          {dropdownOpen && !showModal && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile/history");
                }}
              >
                Your Orders
              </button>
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

          {/* Logout confirmation modal */}
          {showModal && (
            <Modal
              title="Confirm Logout"
              image={null}
              onClose={() => setShowModal(false)}
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
        <Button
          variant="link"
          onClick={() => loginWithRedirect({ screen_hint: "login" })}
        >
          Login
        </Button>
      )}
    </>
  );
}
