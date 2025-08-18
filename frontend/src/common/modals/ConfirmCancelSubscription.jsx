import React, { useEffect } from "react";
import { Button } from "common";

/**
 * Simple confirmation modal for canceling a subscription.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onConfirm: () => Promise<void> | void
 * - loading?: boolean          // disables buttons + shows "Cancelling..."
 * - productTitle?: string      // name shown in the body
 */
export default function ConfirmCancelSubscription({
  open,
  onClose,
  onConfirm,
  loading = false,
  productTitle = "",
}) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Cancel your subscription?
        </h2>

        <p className="text-gray-600 mb-5">
          {productTitle ? (
            <>
              Your subscription for <span className="font-medium">{productTitle}</span> will be
              canceled. You can re-subscribe anytime.
            </>
          ) : (
            "Your subscription will be canceled. You can re-subscribe anytime."
          )}
        </p>

        {/* Primary destructive action — big boxed button */}
        <Button
          variant="danger"
          className="w-full h-12 text-base rounded-md mb-3"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Cancelling…" : "Cancel subscription"}
        </Button>

        {/* Secondary */}
        <button
          type="button"
          className="w-full h-12 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          onClick={onClose}
          disabled={loading}
        >
          Keep subscription
        </button>
      </div>
    </div>
  );
}
