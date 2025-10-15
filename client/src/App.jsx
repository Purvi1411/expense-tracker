// client/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';

const App = () => {
    return (
        <div className="App">
            {/* Header and Nav can go here if global */}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage isRegister={true} />} />
                
                {/* Protected Routes: All routes inside this must pass the token check */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} /> 
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Add other protected routes here (e.g., /reports) */}
                </Route>

                {/* Catch-all for 404 pages (optional) */}
                <Route path="*" element={<h1>404: Page Not Found</h1>} /> 
            </Routes>
        </div>
    );
};

export default App;
