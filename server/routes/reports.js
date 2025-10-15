const express = require('express');
const router = express.Router();
const path = require('path');
const Transaction = require(path.join(__dirname, '..', 'models', 'Transaction.js')); 
const protect = require(path.join(__dirname, '..', 'middleware', 'authMiddleware.js'));

router.use(protect);

// @route   GET /api/reports/monthly-summary
// @desc    Get total income and expenses for each month
// @access  Private
router.get('/monthly-summary', async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
            // 1. Project: Create a reliable 'dateValue' field
            {
                $project: {
                    userId: "$userId",
                    amount: "$amount",
                    type: "$type",
                    // Use 'date' if defined, otherwise fall back to 'createdAt'
                    dateValue: {
                        $ifNull: ["$date", "$createdAt"] 
                    }
                }
            },
            
            // 2. Filter: Ensure we only process transactions with a valid date and for the user
            { 
                $match: { 
                    userId: req.user.id,
                    dateValue: { $exists: true, $ne: null }
                } 
            },
            
            // 3. Group: Calculate totals for each unique Year-Month pair
            {
                $group: {
                    _id: {
                        year: { $year: "$dateValue" },
                        month: { $month: "$dateValue" }
                    },
                    totalIncome: {
                        // Check type while converting to lowercase to handle casing issues
                        $sum: { $cond: [{ $eq: [{ $toLower: "$type" }, "income"] }, "$amount", 0] }
                    },
                    totalExpenses: {
                        $sum: { $cond: [{ $eq: [{ $toLower: "$type" }, "expense"] }, "$amount", 0] }
                    }
                }
            },
            
            // 4. Sort: Order the results chronologically
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        res.json(summary);
        
    } catch (err) {
        console.error("Aggregation Error:", err.message);
        res.status(500).send('Server Error during report generation');
    }
});

module.exports = router;