// src/pages/ProtectedPage.tsx
import React, { useEffect } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useAuthAxios } from '../hooks/useAuthAxios';

const ProtectedPageComponent: React.FC = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const axios = useAuthAxios();
   useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log('🔐 Auth0 Token:', token);

        // Example API call with authAxios (optional)
        const res = await axios.get('http://localhost:3001/items');
        console.log('📦 Items:', res.data);
      } catch (err) {
        console.error('❌ Error getting token or calling API:', err);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [getAccessTokenSilently, isAuthenticated, axios]);

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
