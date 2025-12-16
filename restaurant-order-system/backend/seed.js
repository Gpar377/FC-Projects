const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@restaurant.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    
    // Sample menu items
    const menuItems = [
      {
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken and spices',
        price: 250,
        category: 'Main Course',
        preparationTime: 25,
        available: true
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Creamy tomato-based curry with soft paneer cubes',
        price: 180,
        category: 'Main Course',
        preparationTime: 15,
        available: true
      },
      {
        name: 'Masala Dosa',
        description: 'Crispy rice crepe filled with spiced potato mixture',
        price: 120,
        category: 'South Indian',
        preparationTime: 12,
        available: true
      },
      {
        name: 'Chole Bhature',
        description: 'Spicy chickpea curry served with fluffy fried bread',
        price: 150,
        category: 'North Indian',
        preparationTime: 10,
        available: true
      },
      {
        name: 'Veg Fried Rice',
        description: 'Stir-fried rice with mixed vegetables and soy sauce',
        price: 140,
        category: 'Chinese',
        preparationTime: 15,
        available: true
      },
      {
        name: 'Chicken Tikka',
        description: 'Grilled marinated chicken pieces with mint chutney',
        price: 220,
        category: 'Starters',
        preparationTime: 20,
        available: true
      },
      {
        name: 'Samosa (2 pcs)',
        description: 'Crispy pastry filled with spiced potatoes and peas',
        price: 60,
        category: 'Snacks',
        preparationTime: 5,
        available: true
      },
      {
        name: 'Gulab Jamun (2 pcs)',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 80,
        category: 'Desserts',
        preparationTime: 3,
        available: true
      },
      {
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink with mango pulp',
        price: 70,
        category: 'Beverages',
        preparationTime: 3,
        available: true
      },
      {
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 30,
        category: 'Beverages',
        preparationTime: 5,
        available: true
      }
    ];
    
    await MenuItem.insertMany(menuItems);
    
    console.log('✅ Database seeded successfully!');
    console.log('Admin credentials: admin@restaurant.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();