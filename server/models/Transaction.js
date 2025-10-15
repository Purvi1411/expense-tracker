const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add a description'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    type: {
        type: String,
        required: true, // 'income' or 'expense'
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Please add a category'],
    },
    // This is the crucial field
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);