const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    month: { // e.g., 9 for October (0-indexed)
        type: Number,
        required: true,
    },
    year: { // e.g., 2025
        type: Number,
        required: true,
    },
}, { timestamps: true });

// Ensure a user can only have one budget per category per month/year
BudgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);