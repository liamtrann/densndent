import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
<Auth0Provider
    domain="dev-t4rfoykvilkxt4zn.us.auth0.com"
    clientId="fn4WBlqisj4sg5f4HfnaCeQOcLRh6K4B"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-t4rfoykvilkxt4zn.us.auth0.com/api/v2/"
    }}
  >
    <App />
  </Auth0Provider>,
);

