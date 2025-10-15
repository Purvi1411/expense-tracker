import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinancialSummaryChart = ({ income, expenses, netBalance }) => {
    
    const data = {
        labels: ['Income', 'Expenses', 'Net Balance'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [income, expenses, netBalance],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)', // Income (Teal/Green)
                    'rgba(255, 99, 132, 0.8)', // Expenses (Red/Pink)
                    netBalance >= 0 ? 'rgba(54, 162, 235, 0.8)' : 'rgba(255, 159, 64, 0.8)', // Net Balance (Blue or Orange)
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)',
                    netBalance >= 0 ? 'rgb(54, 162, 235)' : 'rgb(255, 159, 64)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Financial Overview', font: { size: 18 } }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₹'+ value.toLocaleString();
                    }
                }
            },
        },
    };

    if (income === 0 && expenses === 0) {
        return <p className="text-center text-gray-500 py-4">Add some income and expense transactions to see this chart.</p>;
    }

    return <Bar options={options} data={data} />;
};

export default FinancialSummaryChart;