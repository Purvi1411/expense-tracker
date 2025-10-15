// client/src/components/TransactionItem.jsx

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const TransactionItem = ({ transaction, onTransactionUpdate }) => {
    const { _id, description, category, type, amount, date } = transaction;
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ description, category, amount: amount.toFixed(2) });
    const [loading, setLoading] = useState(false);
    
    const formattedDate = new Date(date).toLocaleDateString(); 

    // --- DELETE Logic ---
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the transaction: ${description}?`)) return;
        setLoading(true);
        try {
            await axiosInstance.delete(`/transactions/${_id}`);
            onTransactionUpdate(); // Refresh the list
        } catch (err) {
            alert('Failed to delete transaction. See console for details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- UPDATE Logic ---
    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const payload = { ...editData, amount: parseFloat(editData.amount) };

        try {
            await axiosInstance.patch(`/api/transactions/${_id}`, payload);
            setIsEditing(false); // Close the form
            onTransactionUpdate(); // Refresh the list
        } catch (err) {
            alert('Failed to update transaction. Check input values.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const amountColor = type === 'income' ? 'green' : 'red';
    const sign = type === 'income' ? '+' : '-';

    if (isEditing) {
        return (
            <form onSubmit={handleEditSubmit} className="grid grid-cols-5 gap-4 items-center py-3 px-4 bg-gray-50">
                <input 
                    type="text" 
                    name="description" 
                    value={editData.description} 
                    onChange={handleEditChange} 
                    required 
                    className="input-field text-sm"
                />
                <input 
                    type="text" 
                    name="category" 
                    value={editData.category} 
                    onChange={handleEditChange} 
                    required 
                    className="input-field text-sm"
                />
                <span className="text-sm text-gray-600">{formattedDate}</span>
                <input 
                    type="number" 
                    name="amount" 
                    value={editData.amount} 
                    onChange={handleEditChange} 
                    required 
                    min="0.01" 
                    step="0.01" 
                    className="input-field text-sm"
                />
                <div className="flex space-x-2">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                        Save
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(false)} 
                        disabled={loading}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="grid grid-cols-5 gap-4 items-center py-3 px-4 hover:bg-gray-50">
            <span className="text-sm text-gray-900">{description}</span>
            <span className="text-sm text-gray-600">{category}</span>
            <span className="text-sm text-gray-600">{formattedDate}</span>
            <span className={`text-sm font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {sign}${amount.toFixed(2)}
            </span>
            <div className="flex space-x-2">
                <button 
                    onClick={() => setIsEditing(true)} 
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    Edit
                </button>
                <button 
                    onClick={handleDelete} 
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;