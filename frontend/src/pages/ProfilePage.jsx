import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfilePage() {
    const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect();
            return;
        }
        if (!isLoading && isAuthenticated) {
            (async () => {
                try {
                    const token = await getAccessTokenSilently({
                        audience: process.env.REACT_APP_AUTH0_AUDIENCE
                    });
                    console.log('Access Token:', token);
                } catch (err) {
                    console.error('Error getting access token:', err);
                }
            })();
        }
    }, [isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
                <div className="bg-white p-6 rounded shadow">
                    <p className="text-lg text-gray-700 mb-4">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
            <div className="bg-white p-6 rounded shadow">
                <p className="text-lg text-gray-700 mb-4">This is your profile page. Display user info and settings here.</p>
            </div>
        </div>
    );
}
