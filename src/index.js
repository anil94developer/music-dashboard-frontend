import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import { UserProfileProvider } from './Context/UserProfileContext';
 



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProfileProvider>
    <Router>
      <App />
    </Router>
  </UserProfileProvider>

);

reportWebVitals();
