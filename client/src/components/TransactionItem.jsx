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
            <form onSubmit={handleEditSubmit} className="transaction-item editing">
                <input type="text" name="description" value={editData.description} onChange={handleEditChange} required />
                <input type="text" name="category" value={editData.category} onChange={handleEditChange} required />
                <span>{formattedDate}</span>
                <input type="number" name="amount" value={editData.amount} onChange={handleEditChange} required min="0.01" step="0.01" />
                <div className="actions">
                    <button type="submit" disabled={loading}>Save</button>
                    <button type="button" onClick={() => setIsEditing(false)} disabled={loading}>Cancel</button>
                </div>
            </form>
        );
    }

    return (
        <div className="transaction-item">
            <span>{description}</span>
            <span>{category}</span>
            <span>{formattedDate}</span>
            <span style={{ color: amountColor }}>{sign}${amount.toFixed(2)}</span>
            <div className="actions">
                <button onClick={() => setIsEditing(true)} disabled={loading}>Edit</button>
                <button onClick={handleDelete} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;