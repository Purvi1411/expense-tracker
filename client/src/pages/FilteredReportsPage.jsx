import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ExpenseChart from '../components/ExpenseChart'; // Your existing Pie Chart component

const FilteredReportsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter states (Removed searchQuery)
    const [typeFilter, setTypeFilter] = useState('expense'); // Default to expense
    const [categoryFilter, setCategoryFilter] = useState('all');

    const availableCategories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transport','Others','Investment'];

    // Core function to fetch data based on current filters
    const fetchFilteredData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        // Removed logic for searchQuery from params
        if (typeFilter !== 'all') params.append('type', typeFilter);
        if (categoryFilter !== 'all') params.append('category', categoryFilter);

        const url = `/transactions?${params.toString()}`;
        
        try {
            const response = await axiosInstance.get(url);
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching filtered data:', err);
            setError('Failed to load filtered data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [typeFilter, categoryFilter]); // Dependencies updated

    // Fetch initial data when component mounts
    useEffect(() => {
        fetchFilteredData();
    }, [fetchFilteredData]);

    const handleResetFilters = () => {
        // Removed logic for searchQuery
        setTypeFilter('expense'); 
        setCategoryFilter('all');
        // fetchFilteredData will be triggered via the useEffect dependency array
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Filter & Analyze</h1>
                <Link to="/" className="btn-secondary">Back to Dashboard</Link>
            </header>
            
            <div className="max-w-7xl mx-auto">
                {/* --- 1. FILTER FORM SECTION --- */}
                <div className="bg-white shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Filter Transactions</h2>
                        {/* Simplified grid layout for 4 items: Type, Category, Apply, Reset */}
                        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-4 items-end">
                            
                            {/* Removed Search Input */}

                            {/* Type Filter */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                                <select id="type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="all">All</option>
                                    
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            {/* Category Filter */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select id="category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="all">All</option>
                                    {availableCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                            
                            {/* Apply Button - Fetches data when clicked */}
                            <button type="button" onClick={fetchFilteredData} className="btn-primary w-full">Apply Filters</button>
                            {/* Reset Button */}
                            <button type="button" onClick={handleResetFilters} className="btn-secondary w-full">Reset</button>
                        </form>
                    </div>
                </div>
                
                {/* --- 2. CHART VISUALIZATION SECTION --- */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown ({typeFilter} View)</h2>
                        {loading ? (
                            <p className="text-center text-gray-500">Loading chart data...</p>
                        ) : error ? (
                            <p className="text-center text-red-600">{error}</p>
                        ) : transactions.length === 0 ? (
                            <p className="text-center text-gray-500">No transactions found matching your filter criteria.</p>
                        ) : (
                            // The ExpenseChart component will process the filtered list
                            <ExpenseChart transactions={transactions} /> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilteredReportsPage;