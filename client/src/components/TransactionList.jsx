// client/src/components/TransactionList.jsx

import React from 'react';
// This assumes you create a file named TransactionItem.jsx in the same folder
import TransactionItem from './TransactionItem.jsx'; 

const TransactionList = ({ transactions, onTransactionUpdate }) => {
    if (!transactions || transactions.length === 0) {
        return <p>No transactions recorded yet.</p>;
    }

    return (
        <div className="overflow-hidden">
            <div className="grid grid-cols-5 gap-4 bg-gray-50 py-3 px-4 text-sm font-medium text-gray-500">
                <span>Description</span>
                <span>Category</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Actions</span>
            </div>

            <div className="divide-y divide-gray-200">
                {transactions.map(transaction => (
                    <TransactionItem 
                        key={transaction._id} 
                        transaction={transaction} 
                        onTransactionUpdate={onTransactionUpdate} 
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;