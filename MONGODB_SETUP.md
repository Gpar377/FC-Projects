# MongoDB Atlas Setup Guide

## Step 1: Create Free Cluster
1. Choose **Free** tier (512 MB)
2. Select **AWS** provider
3. Choose **Mumbai (ap-south-1)** region
4. Enable "Automate security setup"
5. Enable "Preload sample dataset"
6. Click "Create"

## Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 3: Update .env Files

### Personal Finance Tracker
```bash
# backend/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5000
```

### Restaurant Order System
```bash
# backend/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/restaurant-orders?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5000
```

### Multi-Language Translator
```bash
# backend/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/translator?retryWrites=true&w=majority
PORT=5000
```

## Step 4: Replace Placeholders
- Replace `<username>` with your MongoDB username
- Replace `<password>` with your MongoDB password
- Replace `xxxxx` with your actual cluster ID

## Step 5: Test Connection
Run any backend server:
```bash
cd backend
npm run dev
```

You should see: "Connected to MongoDB" or similar message.

## MongoDB Structure for Your Projects

### Finance Tracker Collections:
- `users` - User accounts
- `transactions` - Income/expense records

### Restaurant System Collections:
- `users` - Customer/admin accounts
- `menuitems` - Food items
- `orders` - Order records

### Translator Collections:
- `translations` - Translation history

## Common MongoDB Operations

### Create Document:
```javascript
const user = new User({ name: "John", email: "john@email.com" });
await user.save();
```

### Find Documents:
```javascript
const users = await User.find({ active: true });
const user = await User.findById(userId);
```

### Update Document:
```javascript
await User.findByIdAndUpdate(userId, { name: "New Name" });
```

### Delete Document:
```javascript
await User.findByIdAndDelete(userId);
```

## Troubleshooting

### Connection Issues:
1. Check username/password
2. Verify IP whitelist (0.0.0.0/0 for development)
3. Ensure correct connection string format

### Database Not Found:
- MongoDB creates databases automatically when first document is inserted
- Database names are case-sensitive

### Authentication Errors:
- Verify credentials in Atlas dashboard
- Check if user has proper permissions