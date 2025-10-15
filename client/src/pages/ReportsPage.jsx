import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext'; // Assuming you use global context
import ExpenseChart from '../components/ExpenseChart';
import FinancialSummaryChart from '../components/FinancialSummaryChart'; 
import MonthlySummaryChart from '../components/MonthlySummaryChart'; // 1. IMPORT the Line Chart component

const ReportsPage = () => {
    // We use the global transactions and loading status
    const { transactions, loading } = useTransactions();
    
    // 2. Calculate the totals locally (Unchanged)
    const { income, expenses, netBalance } = transactions.reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else if (t.type === 'expense') acc.expenses += t.amount;
        return acc;
    }, { income: 0, expenses: 0, netBalance: 0 });

    // Net balance calculation
    const finalNetBalance = income - expenses;

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Reports & Visuals</h1>
                <Link to="/" className="btn-secondary">Back to Dashboard</Link>
            </header>
            
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* --- 2. NEW CHART: Monthly Income vs. Expenses TREND LINE CHART --- */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <MonthlySummaryChart transactions={transactions} />
                    </div>
                </div>
                
                {/* Total Financial Overview (Bar Chart) */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <FinancialSummaryChart 
                            income={income}
                            expenses={expenses}
                            netBalance={finalNetBalance}
                        />
                    </div>
                </div>

                {/* Existing Expense Breakdown Chart (Pie Chart) */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Expense Breakdown by Category</h2>
                        {loading ? (
                            <p className="text-center text-gray-500">Loading chart data...</p>
                        ) : (
                            <ExpenseChart transactions={transactions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;