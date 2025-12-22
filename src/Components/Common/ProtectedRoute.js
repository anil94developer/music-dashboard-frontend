import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserProfile } from '../../Context/UserProfileContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { userProfile } = useUserProfile();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check localStorage first for instant loading
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      
      if (token && userData) {
        try {
          const parsedUser = typeof userData === 'string' ? JSON.parse(userData) : userData;
          if (parsedUser && parsedUser.role) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      
      // If no localStorage data, check userProfile from context
      if (userProfile && userProfile.role) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [userProfile]);

  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: '#667eea', fontSize: '16px', fontWeight: 500 }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const userRole = userProfile?.role || (localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData"))?.role : null);
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/Dashboard" replace />;
    }
  }

  return children;
};

