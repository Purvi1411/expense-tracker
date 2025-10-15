import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TimeComparisonChart = ({ weekly, monthly, yearly }) => {
    const data = {
        labels: ['This Week', 'This Month', 'This Year'],
        datasets: [
            {
                label: 'Total Expenses (₹))',
                data: [weekly, monthly, yearly],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend as the title is descriptive enough
            },
            title: {
                display: true,
                text: 'Expense Comparison: Week vs. Month vs. Year',
                font: { size: 18 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₹' +  + value;
                    }
                }
            },
        },
    };

    return <Bar options={options} data={data} />;
};

export default TimeComparisonChart;