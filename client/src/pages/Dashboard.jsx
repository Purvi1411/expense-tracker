import React, { useState, useEffect, useCallback } from 'react';
// The useTransactions import is not in your provided code, so it's removed.
import { Link } from 'react-router-dom'; // <-- Link component added here
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import AddTransactionForm from '../components/AddForms.jsx'; 
import TransactionList from '../components/TransactionList.jsx';
// ExpenseChart is not needed here as it's moved to a different page.

const Dashboard = () => {
    const { logout, authState } = useAuth();
    
    // Simplified state: 'transactions' now holds all data. The filter states and functions are removed.
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for time-based expense stats (as provided in the original prompt)
    const [weeklyExpenses, setWeeklyExpenses] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [yearlyExpenses, setYearlyExpenses] = useState(0);

    // Filter states (as provided in the original prompt)
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    
    // Extra state variable (as provided in the original prompt)
    const [unfilteredTransactions, setUnfilteredTransactions] = useState([]);


    const availableCategories = ['Food', 'Salary', 'Rent', 'Utilities', 'Entertainment', 'Transport'];

    // This function fetches ALL data and updates the main transaction list.
    const fetchMasterData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/transactions');
            // Retaining original state setting logic
            setUnfilteredTransactions(response.data); 
            setTransactions(response.data); 
        } catch (err) {
            console.error('Error fetching master data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data load on component mount
    useEffect(() => {
        fetchMasterData();
    }, [fetchMasterData]);

    // This useEffect calculates all stats whenever the transaction list changes.
    useEffect(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Assumes Sunday is the start
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Using transactions for calculation as per original logic
        const weekly = transactions
            .filter(t => t.type === 'expense' && t.date && new Date(t.date) >= startOfWeek)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthly = transactions
            .filter(t => t.type === 'expense' && t.date && new Date(t.date) >= startOfMonth)
            .reduce((sum, t) => sum + t.amount, 0);

        const yearly = transactions
            .filter(t => t.type === 'expense' && t.date && new Date(t.date) >= startOfYear)
            .reduce((sum, t) => sum + t.amount, 0);

        setWeeklyExpenses(weekly);
        setMonthlyExpenses(monthly);
        setYearlyExpenses(yearly);

    }, [transactions]); // Depend on transactions state

    // This function calculates the main balances from the transaction list
    const { income, expenses, netBalance } = (() => {
        let income = 0, expenses = 0;
        transactions.forEach(t => {
            if (t.type === 'income') income += t.amount;
            else if (t.type === 'expense') expenses += t.amount;
        });
        return { income, expenses, netBalance: income - expenses };
    })();

    // Retaining original filter functions (which are now unused)
    const applyFilters = () => {
        let filtered = [...unfilteredTransactions];

        if (searchQuery) {
            filtered = filtered.filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }
        setTransactions(filtered);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setTypeFilter('all');
        setCategoryFilter('all');
        setTransactions(transactions); 
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome, {authState.user?.email || 'User'}!
                </h1>
               
                <div className="flex items-center space-x-4">
                     <Link to="/budgets" className="text-sm font-medium ...">Budgets</Link>
                      <Link to="/reports" className="text-sm font-medium ...">Reports</Link>
                       <Link to="/trends" className="text-sm font-medium ...">Trends</Link>
                        {/* ADD THE NEW LINK HERE */}
                         <Link to="/filter" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                          Filter View
                           </Link>
                            <button onClick={logout} className="btn-secondary">Log Out</button>
                            </div>

            </header>
            
            {/* Grid with all 6 stat cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-5 sm:grid-cols-3 mb-8">
                {/* Net Balance Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Net Balance</h3>
                        <p className={`mt-2 text-3xl font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{netBalance.toFixed(2)}</p>
                    </div>
                </div>
                {/* Total Income Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Total Income</h3>
                        <p className="mt-2 text-3xl font-semibold text-green-600">₹{income.toFixed(2)}</p>
                    </div>
                </div>
                {/* Total Expenses Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Total Expenses</h3>
                        <p className="mt-2 text-3xl font-semibold text-red-600">₹{expenses.toFixed(2)}</p>
                    </div>
                </div>
                {/* Weekly Expenses Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Expenses (This Week)</h3>
                        <p className="mt-2 text-3xl font-semibold text-red-600">₹{weeklyExpenses.toFixed(2)}</p>
                    </div>
                </div>
                {/* Monthly Expenses Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Expenses (This Month)</h3>
                        <p className="mt-2 text-3xl font-semibold text-red-600">₹{monthlyExpenses.toFixed(2)}</p>
                    </div>
                </div>
                {/* Yearly Expenses Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Expenses (This Year)</h3>
                        <p className="mt-2 text-3xl font-semibold text-red-600">₹{yearlyExpenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* --- THE "FILTER TRANSACTIONS" SECTION IS REMOVED --- */}
                
                {/* Add Transaction Form */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Transaction</h2>
                        <AddTransactionForm onTransactionSuccess={fetchMasterData} />
                    </div>
                </div>
                
                {/* Transaction History */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Transaction History</h2>
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        {loading ? <p className="text-gray-500">Loading transactions...</p> : (
                            <TransactionList 
                                transactions={transactions} 
                                onTransactionUpdate={fetchMasterData} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;