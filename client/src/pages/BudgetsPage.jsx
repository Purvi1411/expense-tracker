import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTransactions } from '../context/TransactionContext';
import axiosInstance from '../utils/axiosInstance';
import BudgetChart from '../components/BudgetChart';

// ProgressBar sub-component (no changes needed)
const ProgressBar = ({ current, total }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage > 75 && percentage <= 90) barColor = 'bg-yellow-500';
    else if (percentage > 90) barColor = 'bg-red-500';
    return <div className="w-full bg-gray-200 rounded-full h-4"><div className={`${barColor} h-4 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div></div>;
};

const BudgetsPage = () => {
    const { transactions, loading: transactionsLoading } = useTransactions();
    
    const [budgets, setBudgets] = useState({});
    const [spent, setSpent] = useState({});
    const [budgetsLoading, setBudgetsLoading] = useState(true);
    const [error, setError] = useState(null);

    const availableCategories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transport'];

    const fetchBudgets = useCallback(async () => {
        setBudgetsLoading(true);
        setError(null);
        try {
            const budgetsRes = await axiosInstance.get('/budgets');
            const budgetsMap = budgetsRes.data.reduce((acc, budget) => {
                acc[budget.category] = budget.amount;
                return acc;
            }, {});
            setBudgets(budgetsMap);
        } catch (err) {
            console.error("Failed to fetch budget data:", err);
            setError("Could not load budget data. Please try again later.");
        } finally {
            setBudgetsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    // --- UPDATED: Filter transactions to calculate spending for the current month ---
    useEffect(() => {
        if (transactions.length === 0) {
            setSpent({});
            return;
        }

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // 1. Filter transactions to ONLY include the current month and year
        const monthlyExpenses = transactions.filter(t => {
            if (!t.date) return false; 
            
            const transactionDate = new Date(t.date);
            return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            );
        });

        // 2. Calculate money spent per category from the filtered transactions
        const spentMap = monthlyExpenses
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        setSpent(spentMap);

    }, [transactions]); // Depend on transactions

    const handleBudgetChange = async (category, amount) => {
        const newAmount = parseFloat(amount) || 0;
        setBudgets(prev => ({ ...prev, [category]: newAmount }));
        try {
            await axiosInstance.post('/budgets', { category, amount: newAmount });
        } catch (err) {
            console.error("Failed to update budget:", err);
        }
    };

    const hasBudgets = Object.values(budgets).some(amount => amount > 0);

    if (transactionsLoading || budgetsLoading) {
        return <div className="text-center p-10 text-gray-500">Loading budget data...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Monthly Budgets</h1>
                <Link to="/" className="btn-secondary">Back to Dashboard</Link>
            </header>
            
            <div className="max-w-7xl mx-auto">
                {error && <p className="text-center text-red-600">{error}</p>}
                {!error && (
                    <>
                        <div className="bg-white shadow rounded-lg mb-8">
                            <div className="px-4 py-5 sm:p-6">
                                <BudgetChart 
                                    budgets={budgets} 
                                    spent={spent} 
                                    categories={availableCategories} 
                                />
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Category Details</h2>
                                    {/* ## UX Improvement: Show message if no budgets are set ## */}
                                    {!hasBudgets && (
                                        <p className="text-sm text-gray-500">Enter an amount in a budget field to get started!</p>
                                    )}
                                </div>
                                <div className="space-y-8">
                                    {availableCategories.map(category => {
                                        const budgetAmount = budgets[category] || 0;
                                        const spentAmount = spent[category] || 0;
                                        return (
                                            <div key={category}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-lg font-medium">{category}</h3>
                                                    <div className="flex items-center space-x-2">
                                                        <span>Budget: ₹</span>
                                                        <input type="number" defaultValue={budgetAmount} onBlur={(e) => handleBudgetChange(category, e.target.value)} className="w-24 p-1 border rounded-md text-right"/>
                                                    </div>
                                                </div>
                                                <ProgressBar current={spentAmount} total={budgetAmount} />
                                                {/* --- FIXED: Currency symbol and formatting --- */}
                                                <p className="text-right text-sm text-gray-500 mt-1">Spent: ₹{spentAmount.toFixed(2)} of ₹{budgetAmount.toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BudgetsPage;