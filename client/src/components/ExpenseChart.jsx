import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpenseChart = ({ transactions }) => {
    // 1. Process data to get total expense per category
    const expenseData = transactions
        .filter(t => t.type === 'expense') // Only consider expenses
        .reduce((acc, transaction) => {
            const category = transaction.category || 'Uncategorized';
            const amount = parseFloat(transaction.amount);
            
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {});

    // 2. Prepare data structure for Chart.js
    const labels = Object.keys(expenseData);
    const dataValues = Object.values(expenseData);
    
    // Predefined colors for the chart segments
    const backgroundColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#4CAF50', '#E91E63'
    ];

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Amount ($)',
            data: dataValues,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows for better responsiveness in a flex/grid container
        plugins: {
            legend: {
                position: 'right', // Position the legend on the side
            },
            title: {
                display: false, // The title is already in the Dashboard card
            },
        },
    };

    // If there's no expense data, show a message instead of an empty chart
    if (dataValues.length === 0) {
        return <p className="text-center text-gray-500">No expense data to display in the chart.</p>;
    }

    return (
        <div style={{ position: 'relative', height: '300px' }}> {/* Container to control chart size */}
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default ExpenseChart;