import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return null;

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{user?.name}</span>
          <Button variant="link" onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </Button>
        </div>
      ) : (
        <Button variant="link" onClick={() => loginWithRedirect({ screen_hint: "login" })}>
          Login
        </Button>
      )}
    </>
  );
}
