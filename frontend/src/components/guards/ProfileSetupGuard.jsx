import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { Loading } from "@/common";

/**
 * Route guard component that redirects to profile setup if user doesn't have a customer profile
 * Use this to protect routes that require a complete user profile
 */
const ProfileSetupGuard = ({ children, redirectTo = "/profile" }) => {
  const { info, needsProfileSetup, loading } = useSelector((state) => ({
    info: state.user.info,
    needsProfileSetup: state.user.needsProfileSetup,
    loading: state.user.loading,
  }));

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <Loading className="mt-4" />
        </div>
      </div>
    );
  }

  // If profile setup is needed or no user info, redirect to profile
  if (needsProfileSetup || !info) {
    return <Navigate to={redirectTo} replace />;
  }

  // User has complete profile, render children
  return children;
};

export default ProfileSetupGuard;
