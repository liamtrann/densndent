import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import ProtectedPage from "./pages/ProtectedPage";
import Home from "./pages/Home";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();

  if (isLoading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/protected">Protected</Link>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Login</button>
        ) : (
          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
          >
            Logout
          </button>
        )}
      </nav>

      {isAuthenticated && (
        <p style={{ paddingLeft: "1rem" }}>
          Logged in as: <strong>{user?.email}</strong>
        </p>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protected" element={<ProtectedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
