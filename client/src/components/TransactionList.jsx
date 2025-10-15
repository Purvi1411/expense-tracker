// client/src/components/TransactionList.jsx

import React from 'react';
// This assumes you create a file named TransactionItem.jsx in the same folder
import TransactionItem from './TransactionItem.jsx'; 

const TransactionList = ({ transactions, onTransactionUpdate }) => {
    if (!transactions || transactions.length === 0) {
        return <p>No transactions recorded yet.</p>;
    }

    return (
        <div className="transaction-history">
            <div className="list-header">
                <span>Description</span>
                <span>Category</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Actions</span>
            </div>

            {/* Map over the transactions and render a TransactionItem for each */}
            {transactions.map(transaction => (
                <TransactionItem 
                    key={transaction._id} 
                    transaction={transaction} 
                    onTransactionUpdate={onTransactionUpdate} 
                />
            ))}
        </div>
    );
};

export default TransactionList;