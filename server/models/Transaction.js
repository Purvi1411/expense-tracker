// server/models/Transaction.js

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Security link: required reference to the User who owns this transaction
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required.'],
        min: [0.01, 'Amount must be greater than zero.'],
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        default: 'expense',
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);