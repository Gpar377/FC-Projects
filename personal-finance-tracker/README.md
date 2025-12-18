# Personal Finance Tracker

A full-stack personal budgeting and expense tracking system built with React.js, Node.js, Express, and MongoDB.

## Features

- 🔐 User registration & login with JWT authentication
- 💰 Add/edit/delete income & expenses
- 🔍 Search & filter transactions (by category, type, date range)
- 📊 Category-wise transaction tracking
- 📈 Monthly analytics with interactive charts (Area, Bar, Pie, Radial)
- 📅 Time range filtering (Week/Month/Year)
- 🎯 Budget goals & tracking with progress bars
- ⚠️ Budget alerts (visual indicators when over budget)
- 📄 Export reports (CSV/PDF)
- 📊 Dashboard with summary statistics & real-time updates
- 🔄 Real-time updates via Socket.io
- 💱 Indian Rupee (₹) currency formatting
- 📉 Savings rate calculator
- 📱 Responsive design

## Tech Stack

**Frontend:**
- React.js with TypeScript
- Recharts for data visualization
- Axios for API calls
- jsPDF for PDF generation

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-secret-key
PORT=5000
```

4. Start MongoDB service on your system

5. Run the backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

1. Register a new account or login with existing credentials
2. Add income and expense transactions using the form
3. View your financial dashboard with charts and statistics
4. Export your transaction history as CSV or PDF
5. Track your spending by categories

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/analytics?startDate=&endDate=` - Get analytics with date range
- `GET /api/transactions/search?category=&type=&startDate=&endDate=` - Search/filter transactions

### Budgets
- `GET /api/budgets?month=YYYY-MM` - Get budgets for specific month
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.tsx
    └── public/
```