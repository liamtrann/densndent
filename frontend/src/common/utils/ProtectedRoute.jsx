import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    if (isLoading) return null;
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-lg text-gray-700 p-8">
                <div className="font-semibold text-2xl mb-2 text-primary-blue">
                    Login Required
                </div>
                <div className="mb-4">
                    You must{" "}
                    <span
                        className="text-smiles-orange font-bold cursor-pointer underline hover:text-smiles-blue transition-colors"
                        onClick={() =>
                            loginWithRedirect()
                        }
                    >
                        Log in
                    </span>{" "}
                    to see this page.
                </div>
                <div className="text-gray-500 text-sm">
                    Please use the login button in the top right corner.
                </div>
            </div>
        );
    }
    return <Outlet />;
}
