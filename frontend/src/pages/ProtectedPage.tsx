// src/pages/ProtectedPage.tsx
import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedPageComponent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-3xl font-bold text-green-700">🔐 Protected Page</h1>
      <p className="mt-4 text-lg text-gray-800">
        You are logged in and authorized to view this content!
      </p>
    </div>
  );
};

export default withAuthenticationRequired(ProtectedPageComponent, {
  onRedirecting: () => (
    <div className="min-h-screen flex items-center justify-center text-xl">
      Redirecting to login...
    </div>
  ),
});
