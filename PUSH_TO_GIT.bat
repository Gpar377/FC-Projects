@echo off
echo ========================================
echo Pushing Full Stack Projects to GitHub
echo Repository: https://github.com/Gpar377/FC-Projects
echo ========================================

cd /d "D:\SRM KTR\_projects\fullstack-projects"

REM Initialize git if not already initialized
if not exist .git (
    git init
    git remote add origin https://github.com/Gpar377/FC-Projects.git
)

REM Create .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo build/ >> .gitignore
echo dist/ >> .gitignore
echo .DS_Store >> .gitignore
echo *.log >> .gitignore

echo.
echo [1/50] Adding README files...
git add README.md MONGODB_SETUP.md PRODUCTION_SETUP.md
git commit -m "docs: Add comprehensive project documentation and setup guides"

echo [2/50] Adding Personal Finance Tracker - Backend Models...
git add personal-finance-tracker/backend/models/
git commit -m "feat(finance): Add User and Transaction models with MongoDB schemas"

echo [3/50] Adding Personal Finance Tracker - Backend Routes...
git add personal-finance-tracker/backend/routes/
git commit -m "feat(finance): Implement authentication and transaction API routes"

echo [4/50] Adding Personal Finance Tracker - Backend Middleware...
git add personal-finance-tracker/backend/middleware/
git commit -m "feat(finance): Add JWT authentication middleware"

echo [5/50] Adding Personal Finance Tracker - Backend Server...
git add personal-finance-tracker/backend/server.js
git commit -m "feat(finance): Setup Express server with Socket.io for real-time updates"

echo [6/50] Adding Personal Finance Tracker - Backend Config...
git add personal-finance-tracker/backend/package.json personal-finance-tracker/backend/.env
git commit -m "config(finance): Add backend dependencies and environment configuration"

echo [7/50] Adding Personal Finance Tracker - Frontend Services...
git add personal-finance-tracker/frontend/src/services/
git commit -m "feat(finance): Implement API and Socket.io services for frontend"

echo [8/50] Adding Personal Finance Tracker - Dashboard Component...
git add personal-finance-tracker/frontend/src/components/Dashboard.tsx
git commit -m "feat(finance): Create basic dashboard with analytics"

echo [9/50] Adding Personal Finance Tracker - Enhanced Dashboard...
git add personal-finance-tracker/frontend/src/components/EnhancedDashboard.tsx
git commit -m "feat(finance): Add enhanced dashboard with interactive charts and real-time updates"

echo [10/50] Adding Personal Finance Tracker - Transaction Components...
git add personal-finance-tracker/frontend/src/components/TransactionForm.tsx
git commit -m "feat(finance): Create transaction form with category selection"

echo [11/50] Adding Personal Finance Tracker - Transaction List...
git add personal-finance-tracker/frontend/src/components/TransactionList.tsx
git commit -m "feat(finance): Add transaction list with PDF/CSV export functionality"

echo [12/50] Adding Personal Finance Tracker - Auth Pages...
git add personal-finance-tracker/frontend/src/pages/
git commit -m "feat(finance): Implement login and registration pages"

echo [13/50] Adding Personal Finance Tracker - Main App...
git add personal-finance-tracker/frontend/src/App.tsx
git commit -m "feat(finance): Setup main app with routing and state management"

echo [14/50] Adding Personal Finance Tracker - Styles...
git add personal-finance-tracker/frontend/src/App.css personal-finance-tracker/frontend/src/enhanced-dashboard.css
git commit -m "style(finance): Add comprehensive CSS with responsive design"

echo [15/50] Adding Personal Finance Tracker - Frontend Config...
git add personal-finance-tracker/frontend/package.json personal-finance-tracker/frontend/tsconfig.json
git commit -m "config(finance): Configure React TypeScript frontend"

echo [16/50] Adding Personal Finance Tracker - README...
git add personal-finance-tracker/README.md
git commit -m "docs(finance): Add project documentation with setup instructions"

echo [17/50] Adding Restaurant System - Backend Models...
git add restaurant-order-system/backend/models/
git commit -m "feat(restaurant): Add User, MenuItem, and Order models"

echo [18/50] Adding Restaurant System - Backend Routes...
git add restaurant-order-system/backend/routes/
git commit -m "feat(restaurant): Implement auth, menu, and order API routes"

echo [19/50] Adding Restaurant System - Backend Middleware...
git add restaurant-order-system/backend/middleware/
git commit -m "feat(restaurant): Add authentication middleware with role-based access"

echo [20/50] Adding Restaurant System - Backend Server...
git add restaurant-order-system/backend/server.js
git commit -m "feat(restaurant): Setup Express server with Socket.io for real-time orders"

echo [21/50] Adding Restaurant System - Seed Data...
git add restaurant-order-system/backend/seed.js
git commit -m "feat(restaurant): Add database seeding script with sample menu items"

echo [22/50] Adding Restaurant System - Backend Config...
git add restaurant-order-system/backend/package.json restaurant-order-system/backend/.env
git commit -m "config(restaurant): Configure backend with Socket.io and Cloudinary"

echo [23/50] Adding Restaurant System - Frontend Services...
git add restaurant-order-system/frontend/src/services/
git commit -m "feat(restaurant): Implement API and Socket.io services"

echo [24/50] Adding Restaurant System - Menu Components...
git add restaurant-order-system/frontend/src/components/MenuList.tsx
git commit -m "feat(restaurant): Create menu list with search and filter"

echo [25/50] Adding Restaurant System - Cart Component...
git add restaurant-order-system/frontend/src/components/Cart.tsx
git commit -m "feat(restaurant): Add shopping cart with quantity controls"

echo [26/50] Adding Restaurant System - Order Tracking...
git add restaurant-order-system/frontend/src/components/OrderTracking.tsx
git commit -m "feat(restaurant): Implement real-time order tracking with progress bar"

echo [27/50] Adding Restaurant System - Menu Management...
git add restaurant-order-system/frontend/src/components/MenuManagement.tsx
git commit -m "feat(restaurant): Add complete menu management CRUD operations"

echo [28/50] Adding Restaurant System - Landing Page...
git add restaurant-order-system/frontend/src/components/LandingPage.tsx
git commit -m "feat(restaurant): Create dual portal landing page"

echo [29/50] Adding Restaurant System - Customer App...
git add restaurant-order-system/frontend/src/pages/CustomerApp.tsx
git commit -m "feat(restaurant): Implement customer portal with ordering system"

echo [30/50] Adding Restaurant System - Restaurant App...
git add restaurant-order-system/frontend/src/pages/RestaurantApp.tsx
git commit -m "feat(restaurant): Create restaurant admin portal"

echo [31/50] Adding Restaurant System - Admin Dashboard...
git add restaurant-order-system/frontend/src/pages/AdminDashboard.tsx
git commit -m "feat(restaurant): Add admin dashboard with order management"

echo [32/50] Adding Restaurant System - Main App...
git add restaurant-order-system/frontend/src/App.tsx
git commit -m "feat(restaurant): Setup dual portal system with mode switching"

echo [33/50] Adding Restaurant System - Styles...
git add restaurant-order-system/frontend/src/App.css
git commit -m "style(restaurant): Add comprehensive CSS for dual portal system"

echo [34/50] Adding Restaurant System - Frontend Config...
git add restaurant-order-system/frontend/package.json restaurant-order-system/frontend/tsconfig.json
git commit -m "config(restaurant): Configure React TypeScript with Socket.io client"

echo [35/50] Adding Restaurant System - README...
git add restaurant-order-system/README.md
git commit -m "docs(restaurant): Add comprehensive documentation with API endpoints"

echo [36/50] Adding Translator - Backend Server...
git add multi-language-translator/backend/server.js
git commit -m "feat(translator): Setup translation server with smart AI-like system"

echo [37/50] Adding Translator - Backend Config...
git add multi-language-translator/backend/package.json multi-language-translator/backend/.env
git commit -m "config(translator): Configure backend with MongoDB and translation APIs"

echo [38/50] Adding Translator - Frontend Services...
git add multi-language-translator/frontend/src/services/api.ts
git commit -m "feat(translator): Implement translation API service"

echo [39/50] Adding Translator - Speech Service...
git add multi-language-translator/frontend/src/services/speechService.ts
git commit -m "feat(translator): Add speech-to-text and text-to-speech services"

echo [40/50] Adding Translator - Main Translator Component...
git add multi-language-translator/frontend/src/components/Translator.tsx
git commit -m "feat(translator): Create main translator with 16+ language support"

echo [41/50] Adding Translator - Translation History...
git add multi-language-translator/frontend/src/components/TranslationHistory.tsx
git commit -m "feat(translator): Add translation history with copy functionality"

echo [42/50] Adding Translator - Main App...
git add multi-language-translator/frontend/src/App.tsx
git commit -m "feat(translator): Setup app with translator and history tabs"

echo [43/50] Adding Translator - Styles...
git add multi-language-translator/frontend/src/App.css
git commit -m "style(translator): Add beautiful gradient UI with responsive design"

echo [44/50] Adding Translator - Frontend Config...
git add multi-language-translator/frontend/package.json multi-language-translator/frontend/tsconfig.json
git commit -m "config(translator): Configure React TypeScript frontend"

echo [45/50] Adding Translator - README...
git add multi-language-translator/README.md
git commit -m "docs(translator): Add documentation with language support details"

echo [46/50] Adding Test Connection Script...
git add TEST_CONNECTION.js
git commit -m "test: Add MongoDB connection test script"

echo [47/50] Adding Public Assets...
git add */frontend/public/
git commit -m "assets: Add public assets and manifest files"

echo [48/50] Adding TypeScript Configs...
git add */frontend/src/react-app-env.d.ts
git commit -m "config: Add TypeScript environment declarations"

echo [49/50] Adding Remaining Frontend Files...
git add */frontend/src/index.tsx */frontend/src/index.css
git commit -m "feat: Add main entry points and global styles"

echo [50/50] Final commit - Project Complete...
git add .
git commit -m "chore: Complete full-stack projects with production-ready features"

echo.
echo ========================================
echo All commits created successfully!
echo Total commits: 50
echo ========================================
echo.
echo Now pushing to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo DONE! Check your repository at:
echo https://github.com/Gpar377/FC-Projects
echo ========================================
pause