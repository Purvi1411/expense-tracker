import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import AddTransactionForm from '../components/AddForms.jsx'; 
import TransactionList from '../components/TransactionList.jsx';
import ExpenseChart from '../components/ExpenseChart.jsx';

const Dashboard = () => {
    const { logout, authState } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const availableCategories = ['Food', 'Salary', 'Rent', 'Utilities', 'Entertainment', 'Transport'];

    // --- REFACTORED FETCH LOGIC ---
    // This function now accepts filters as an argument for stability and reliability.
    const fetchTransactions = useCallback(async (currentFilters) => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (currentFilters.searchQuery) params.append('search', currentFilters.searchQuery);
        if (currentFilters.typeFilter !== 'all') params.append('type', currentFilters.typeFilter);
        if (currentFilters.categoryFilter !== 'all') params.append('category', currentFilters.categoryFilter);

        const queryString = params.toString();
        const url = `/transactions${queryString ? `?${queryString}` : ''}`;
        
        try {
            const response = await axiosInstance.get(url);
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array makes this function stable.

    useEffect(() => {
        // Initial fetch on component mount with default filters.
        fetchTransactions({ searchQuery: '', typeFilter: 'all', categoryFilter: 'all' });
    }, [fetchTransactions]);

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

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // Pass the current state of filters to the fetch function
        fetchTransactions({ searchQuery, typeFilter, categoryFilter });
    };

    // --- NEW RESET FUNCTION ---
    const handleResetFilters = () => {
        // 1. Reset the state variables for the filter inputs
        setSearchQuery('');
        setTypeFilter('all');
        setCategoryFilter('all');
        
        // 2. Immediately fetch with the reset (default) values
        fetchTransactions({ searchQuery: '', typeFilter: 'all', categoryFilter: 'all' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome, {authState.user?.email || 'User'}!
                </h1>
                <button onClick={logout} className="btn-secondary">
                    Log Out
                </button>
            </header>
            
            {/* Balance, Income, Expense Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                {/* Net Balance Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Net Balance</h3>
                        <p className={`mt-2 text-3xl font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${netBalance.toFixed(2)}
                        </p>
                    </div>
                </div>
                {/* Total Income Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                     <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Total Income</h3>
                        <p className="mt-2 text-3xl font-semibold text-green-600">${income.toFixed(2)}</p>
                    </div>
                </div>
                {/* Total Expenses Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Total Expenses</h3>
                        <p className="mt-2 text-3xl font-semibold text-red-600">${expenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Filter Controls Section */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Filter Transactions</h2>
                        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                            {/* Search Input */}
                            <div className="sm:col-span-2 md:col-span-1">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Description</label>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="e.g., Coffee"
                                />
                            </div>
                            {/* Type Filter */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    id="type"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            {/* Category Filter */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    id="category"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="all">All</option>
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Apply Button */}
                            <button type="submit" className="btn-primary w-full">
                                Apply Filters
                            </button>
                            {/* --- NEW RESET BUTTON --- */}
                            <button 
                                type="button" 
                                onClick={handleResetFilters} 
                                className="btn-secondary w-full"
                            >
                                Reset
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Add Transaction Form */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Transaction</h2>
                        <AddTransactionForm onTransactionSuccess={() => fetchTransactions({ searchQuery, typeFilter, categoryFilter })} />
                    </div>
                </div>
                
                {/* Expense Chart */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Expense Breakdown</h2>
                        {loading ? (
                            <p className="text-gray-500">Loading chart data...</p>
                        ) : (
                            <ExpenseChart transactions={transactions} />
                        )}
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Transaction History</h2>
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        {loading ? (
                            <p className="text-gray-500">Loading transactions...</p>
                        ) : (
                            <TransactionList 
                                transactions={transactions} 
                                onTransactionUpdate={() => fetchTransactions({ searchQuery, typeFilter, categoryFilter })} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};  

export default Dashboard;