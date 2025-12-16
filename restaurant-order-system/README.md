# Restaurant Order Management System

A campus canteen ordering platform built with React.js, Node.js, Express, MongoDB, and Socket.io for real-time order tracking.

## Features

- **Customer Features:**
  - Browse menu with search & filter functionality
  - Add items to cart with quantity controls
  - Place orders with real-time status tracking
  - View order history
  - Live order status updates (Placed → Preparing → Ready → Completed)

- **Admin Features:**
  - Real-time order management dashboard
  - Update order status with live notifications
  - Menu item management (add/edit/delete)
  - Customer order tracking

## Tech Stack

**Frontend:**
- React.js with TypeScript
- Socket.io-client for real-time updates
- Axios for API calls

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Multer & Cloudinary for image uploads

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

3. Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/restaurant-orders
JWT_SECRET=your-secret-key
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Start MongoDB service

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

### For Customers:
1. Register/Login to the system
2. Browse the menu and use search/filter options
3. Add items to cart and adjust quantities
4. Place order and track status in real-time
5. View order history

### For Admins:
1. Login with admin credentials
2. View incoming orders in real-time
3. Update order status (Placed → Preparing → Ready → Completed)
4. Manage menu items

## API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Menu:**
- `GET /api/menu` - Get menu items (with search/filter)
- `POST /api/menu` - Add menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

**Orders:**
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Real-time Features

- New order notifications for admins
- Live order status updates for customers
- Real-time dashboard updates

## Project Structure

```
restaurant-order-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── MenuList.tsx
    │   │   ├── Cart.tsx
    │   │   └── OrderTracking.tsx
    │   ├── pages/
    │   │   └── AdminDashboard.tsx
    │   ├── services/
    │   │   ├── api.ts
    │   │   └── socket.ts
    │   └── App.tsx
    └── public/
```