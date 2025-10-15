// client/src/pages/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = () => {
    const { authState } = useAuth();
    
    // If user is authenticated, render the child route (Outlet renders Dashboard)
    // If not authenticated, redirect them to the login page
    return authState.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;