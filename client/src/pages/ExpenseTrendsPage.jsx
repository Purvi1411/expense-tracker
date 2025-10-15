import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import TimeComparisonChart from '../components/TimeComparisonChart';

const ExpenseTrendsPage = () => {
    const { transactions, loading } = useTransactions();
    const [weeklyExpenses, setWeeklyExpenses] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [yearlyExpenses, setYearlyExpenses] = useState(0);

    useEffect(() => {
        if (transactions.length > 0) {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfYear = new Date(today.getFullYear(), 0, 1);

            const calculateSum = (periodStart) => 
                transactions
                    .filter(t => t.type === 'expense' && t.date && new Date(t.date) >= periodStart)
                    .reduce((sum, t) => sum + t.amount, 0);

            setWeeklyExpenses(calculateSum(startOfWeek));
            setMonthlyExpenses(calculateSum(startOfMonth));
            setYearlyExpenses(calculateSum(startOfYear));
        }
    }, [transactions]);

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Expense Trends</h1>
                <Link to="/" className="btn-secondary">Back to Dashboard</Link>
            </header>
            
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        {loading ? (
                            <p className="text-center text-gray-500">Loading chart data...</p>
                        ) : (
                            <TimeComparisonChart 
                                weekly={weeklyExpenses}
                                monthly={monthlyExpenses}
                                yearly={yearlyExpenses}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTrendsPage;