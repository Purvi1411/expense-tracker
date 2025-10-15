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

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BudgetChart = ({ budgets, spent, categories }) => {
  // Prepare the data for the chart
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Budgeted (₹)',
        data: categories.map(cat => budgets[cat] || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent (₹)',
        data: categories.map(cat => spent[cat] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Budget vs. Actual Spending',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Format the y-axis labels to include a dollar sign
          callback: function(value) {
            return '₹'   + value;
          }
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BudgetChart;