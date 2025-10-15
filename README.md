 Personal Finance Tracker (Full-Stack Application)
A robust and secure financial management application built on the MERN stack. It allows users to track income and expenses, set monthly budgets, and analyze spending trends over time.

Live Deployment
The application is hosted on cloud services for live accessibility.

Component	Live URL
Frontend (React UI)	[Vercel/Netlify URL Here]
Backend (Node/Express API)	[Render/Heroku API URL Here]


✨ Key Features
Secure Authentication: User registration and login managed via JWT (JSON Web Tokens).

Transaction Management: Full CRUD (Create, Read, Update, Delete) capabilities for all financial entries.

Local Filtering: Instant, client-side filtering for searching and sorting transactions by type or category.

Monthly Budgeting: Dedicated page to set spending limits per category and track progress with dynamic progress bars.

Comprehensive Reporting: Dedicated Reports page featuring:

Financial Summary Chart: Bar chart comparing Total Income vs. Total Expenses vs. Net Balance.

Category Breakdown Chart: Pie chart visualizing expense distribution by category.

Custom Currency: All amounts are displayed in Indian Rupee (₹) currency.

🛠️ Tech Stack
Backend (Server)
Node.js & Express: Runtime environment and application framework.

MongoDB & Mongoose: Database and ODM (Object Data Modeling) for data persistence.

JWT: Secure authentication token management.

Frontend (Client)
React (Vite): JavaScript library for the user interface.

Tailwind CSS: Utility-first CSS framework for rapid styling.

Axios: HTTP client for API communication.

Chart.js & react-chartjs-2: Libraries for data visualization (Bar, Pie/Doughnut, Line Charts).

React Router: For front-end routing and navigation.

🚀 Local Installation & Setup
Follow these steps to get the application running on your local machine.

Prerequisites
Node.js (v18+) and npm

MongoDB Atlas account (or local MongoDB instance)

1. Clone the Repository
Bash

git clone https://github.com/Purvi1411/expense-tracker
cd personal-finance-tracker
2. Configure Environment Variables
In the main server directory, create a file named .env and add the following variables:

Ini, TOML

MONGODB_URI = mongodb+srv://purvipal27_db_user:Passwordd@cluster0.1jjmyck.mongodb.net/expense-tracker
JWT_SECRET = Passwordd
PORT = 8080
3. Backend Setup & Start
Navigate to the server directory, install dependencies, and start the server.

Bash

cd server
npm install
npm start 
# Server will run on http://localhost:8080
4. Frontend Setup & Start
In a new terminal window, navigate to the client directory, install dependencies, and start the React application.

Bash

cd client
npm install
npm run dev
# Frontend will run on http://localhost:5173