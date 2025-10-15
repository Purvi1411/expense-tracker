import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Get initial state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return { 
        token, 
        user, 
        isAuthenticated: !!token 
    };
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialState);

    // Function to handle successful login
    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({ token, user, isAuthenticated: true });
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({ token: null, user: null, isAuthenticated: false });
    };

    // Make state available globally
    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};