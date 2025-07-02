import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";

export default function ProfilePage() {
    const { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently } = useAuth0();
    const [customerLoading, setCustomerLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect();
            return;
        }
        // Fetch customer data by email when authenticated
        if (!isLoading && isAuthenticated && user?.email) {
            setCustomerLoading(true);
            setError(null);
            (async () => {
                try {
                    const token = await getAccessTokenSilently();
                    const res = await api.get(
                        endpoint.GET_CUSTOMER_BY_EMAIL(user.email),
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("Customer data:", res.data);
                } catch (err) {
                    setError(err?.message || "Failed to fetch customer data.");
                    console.error("Failed to fetch customer data:", err);
                } finally {
                    setCustomerLoading(false);
                }
            })();
        }
    }, [isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently]);

    if (isLoading || !isAuthenticated || customerLoading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
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
