import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';
import ExpenseTrendsPage from './pages/ExpenseTrendsPage'; 
import FilteredReportsPage from './pages/FilteredReportsPage'; 
import ProtectedRoute from './pages/ProtectedRoute';

const App = () => {
    return (
        <div className="App">
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage isRegister={true} />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} /> 
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    
                    {/* 2. Your route definition is correct, it just needed the import */}
                    <Route path="/trends" element={<ExpenseTrendsPage />} />
                    <Route path="/filter" element={<FilteredReportsPage />} />
                </Route>

                <Route path="*" element={<h1>404: Page Not Found</h1>} /> 
            </Routes>
        </div>
    );
};

export default App;
