import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// The chart component now takes the full transaction list as a prop
const MonthlySummaryChart = ({ transactions }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            setChartData(null);
            return;
        }

        // --- Data Aggregation Logic (Unchanged) ---
        const monthlyDataMap = transactions.reduce((acc, t) => {
            // ... (Your data grouping logic remains here)
            if (!t.date) return acc;
            const date = new Date(t.date);
            const year = date.getFullYear();
            const month = date.getMonth(); 
            const key = `${year}-${month}`;

            acc[key] = acc[key] || { income: 0, expenses: 0, date: date };

            if (t.type === 'income') {
                acc[key].income += t.amount;
            } else if (t.type === 'expense') {
                acc[key].expenses += t.amount;
            }
            return acc;
        }, {});
        
        // ... (Your data sorting logic remains here) ...
        const sortedKeys = Object.keys(monthlyDataMap).sort((a, b) => (a > b ? 1 : -1));

        const labels = sortedKeys.map(key => {
            const item = monthlyDataMap[key];
            return item.date.toLocaleString('default', { month: 'short', year: 'numeric' });
        });

        const incomeData = sortedKeys.map(key => monthlyDataMap[key].income);
        const expenseData = sortedKeys.map(key => monthlyDataMap[key].expenses);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Total Income (₹)',
                    data: incomeData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.2,
                    fill: false, // Set fill to false for cleaner lines
                    borderWidth: 4, // <<< --- INCREASED BORDER WIDTH
                    pointRadius: 6, // <<< --- INCREASED POINT SIZE for visibility
                },
                {
                    label: 'Total Expenses (₹)',
                    data: expenseData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.2,
                    fill: false, // Set fill to false for cleaner lines
                    borderWidth: 4, // <<< --- INCREASED BORDER WIDTH
                    pointRadius: 6, // <<< --- INCREASED POINT SIZE for visibility
                }
            ]
        });
    }, [transactions]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Income vs. Expenses Trend' }
        },
        scales: {
            y: { 
                beginAtZero: true,
                ticks: {
                    // Custom formatting for Rupee symbol
                    callback: function(value) {
                        return '₹' + value.toLocaleString('en-IN');
                    }
                }
            }
        }
    };

    if (!chartData || chartData.labels.length === 0) {
        return <p className="text-center text-gray-500 py-4">No monthly data available to show trends.</p>;
    }

    return <Line options={options} data={chartData} />;
};

export default MonthlySummaryChart;