import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { TransactionProvider } from './context/TransactionContext.jsx'; // 1. Import the provider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                {/* 2. Wrap the App component */}
                <TransactionProvider>
                    <App />
                </TransactionProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);