// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import './index.css'; // Don't forget your CSS!

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Wrap everything in AuthProvider and BrowserRouter */}
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);