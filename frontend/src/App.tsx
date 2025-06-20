import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedPage from './pages/ProtectedPage';
import Home from './pages/Home';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protected" element={<ProtectedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
