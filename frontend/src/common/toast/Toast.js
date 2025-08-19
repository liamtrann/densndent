import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.css"; // Custom toast styles

// Default toast configuration
const defaultConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// Custom toast utility class
class ToastNotification {
  // Success toast
  static success(message, options = {}) {
    return toast.success(message, {
      ...defaultConfig,
      ...options,
    });
  }

  // Error/Failed toast
  static error(message, options = {}) {
    return toast.error(message, {
      ...defaultConfig,
      autoClose: 5000, // Keep errors visible longer
      ...options,
    });
  }

  // Loading toast (returns toast ID for updating)
  static loading(message = "Loading...", options = {}) {
    return toast.loading(message, {
      ...defaultConfig,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      ...options,
    });
  }

  // Update existing toast (useful for loading states)
  static update(toastId, { render, type, isLoading, ...options }) {
    return toast.update(toastId, {
      render,
      type,
      isLoading,
      ...defaultConfig,
      ...options,
    });
  }

  // Dismiss specific toast
  static dismiss(toastId) {
    return toast.dismiss(toastId);
  }

  // Dismiss all toasts
  static dismissAll() {
    return toast.dismiss();
  }
}

export default ToastNotification;

// Individual exports for convenience
export const { success, error, loading, update, dismiss, dismissAll } =
  ToastNotification;
