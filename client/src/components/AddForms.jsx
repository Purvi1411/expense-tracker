// client/src/components/AddForms.jsx

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

// Categories for the dropdown (must match backend expectations)
const TRANSACTION_CATEGORIES = ['Food', 'Rent', 'Salary', 'Utilities', 'Entertainment', 'Other', 'Investment'];

const AddTransactionForm = ({ onTransactionSuccess }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: TRANSACTION_CATEGORIES[0],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const payload = {
            ...formData,
            amount: parseFloat(formData.amount), 
        };

        try {
            await axiosInstance.post('/transactions', payload);
            
            // Clear form and notify the parent (Dashboard) to refresh data
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                category: TRANSACTION_CATEGORIES[0],
            });
            onTransactionSuccess(); 

        } catch (err) {
            console.error('Failed to add transaction:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to save transaction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="e.g., Grocery Store"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="input-field mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="input-field mt-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select 
                        id="type"
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        className="input-field mt-1"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                        id="category"
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        required
                        className="input-field mt-1"
                    >
                        {TRANSACTION_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </div>
        </form>
    );
};

// NOTE: We export the functional component with the descriptive name, 
// but the file name determines how it is imported above.
export default AddTransactionForm;