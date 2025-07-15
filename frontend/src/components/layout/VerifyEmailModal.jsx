import React from "react";
import { Button } from "../../common";

export default function VerifyEmailModal({ open, onClose, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          Verify Your Email
        </h2>
        <p className="mb-6 text-gray-700">
          An email has been sent to you. Please verify your email before
          continuing.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} variant="primary">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
