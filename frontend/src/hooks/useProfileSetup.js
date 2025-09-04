import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Toast } from "../common";
import { clearProfileSetup } from "../redux/slices/userSlice";

/**
 * Custom hook to handle profile setup flow when user doesn't have a customer profile
 * Automatically redirects to profile page and shows appropriate messaging
 */
export const useProfileSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { needsProfileSetup, redirectTo, loading } = useSelector((state) => ({
    needsProfileSetup: state.user.needsProfileSetup,
    redirectTo: state.user.redirectTo,
    loading: state.user.loading,
  }));

  useEffect(() => {
    if (needsProfileSetup && redirectTo && !loading) {
      // Show welcome message
      Toast.success(
        "Welcome! Please complete your profile to continue shopping."
      );

      // Navigate to profile setup
      navigate(redirectTo);

      // Clear the profile setup state after handling
      dispatch(clearProfileSetup());
    }
  }, [needsProfileSetup, redirectTo, loading, navigate, dispatch]);

  return {
    needsProfileSetup,
    redirectTo,
  };
};

export default useProfileSetup;
