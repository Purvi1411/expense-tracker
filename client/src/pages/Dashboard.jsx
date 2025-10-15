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
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome, {authState.user?.email || 'User'}!
                </h1>
                <button 
                    onClick={logout} 
                    className="btn-secondary"
                >
                    Log Out
                </button>
            </header>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Net Balance</h3>
                        <p className={`mt-2 text-3xl font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${netBalance.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Total Income</h3>
                        <p className="mt-2 text-3xl font-semibold text-green-600">${income.toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Total Expenses</h3>
                        <p className="mt-2 text-3xl font-semibold text-red-600">${expenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Transaction</h2>
                        <AddTransactionForm onTransactionSuccess={fetchTransactions} />
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Transaction History</h2>
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        {loading ? (
                            <p className="text-gray-500">Loading transactions...</p>
                        ) : (
                            <TransactionList 
                                transactions={transactions} 
                                onTransactionUpdate={fetchTransactions} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;