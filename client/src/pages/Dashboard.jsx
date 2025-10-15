// client/src/pages/Dashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
// 🛑 CORRECTED IMPORT 🛑
import AddTransactionForm from '../components/AddForms.jsx'; 
import TransactionList from '../components/TransactionList.jsx';

const Dashboard = () => {
    const { logout, authState } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Core Function: Fetch transactions from the secured API
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/transactions');
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Simple Statistics Calculation
    const calculateBalance = () => {
        let income = 0;
        let expenses = 0;
        transactions.forEach(t => {
            if (t.type === 'income') { income += t.amount; } 
            else if (t.type === 'expense') { expenses += t.amount; }
        });
        const netBalance = income - expenses;
        return { income, expenses, netBalance };
    };

    const { income, expenses, netBalance } = calculateBalance();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {authState.user?.email || 'User'}!</h1>
                <button onClick={logout} className="logout-button">Log Out</button>
            </header>
            
            <div className="summary-cards">
                <div className="card balance-card">
                    <h3>Net Balance</h3>
                    <p style={{ color: netBalance >= 0 ? 'green' : 'red' }}>${netBalance.toFixed(2)}</p>
                </div>
                <div className="card income-card">
                    <h3>Total Income</h3>
                    <p>${income.toFixed(2)}</p>
                </div>
                <div className="card expense-card">
                    <h3>Total Expenses</h3>
                    <p>${expenses.toFixed(2)}</p>
                </div>
            </div>

            <hr />

            <div className="main-content">
                <div className="add-form-section">
                    <h2>Add New Transaction</h2>
                    {/* 🛑 COMPONENT USAGE: Passes the function to refresh the list */}
                    <AddTransactionForm onTransactionSuccess={fetchTransactions} /> 
                </div>

                <div className="history-section">
                    <h2>Transaction History</h2>
                    {error && <p className="error-message">{error}</p>}
                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : (
                        <TransactionList 
                            transactions={transactions} 
                            onTransactionUpdate={fetchTransactions} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;