import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return null;
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-lg text-gray-700 p-8">
        <div className="font-semibold text-2xl mb-2 text-primary-blue">
          Login to Continue
        </div>
        <div className="mb-4">
          Please{" "}
          <span
            className="text-smiles-orange font-bold cursor-pointer underline hover:text-smiles-blue transition-colors"
            onClick={() => loginWithRedirect()}
          >
            login to your account
          </span>{" "}
          to access this page and complete your purchase.
        </div>
        <div className="text-gray-500 text-sm">
          Create an account or login to save your information, track orders, and
          enjoy a faster checkout experience.
        </div>
      </div>
    );
  }
  return <Outlet />;
}
