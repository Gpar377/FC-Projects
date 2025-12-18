import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import CustomerApp from './pages/CustomerApp';
import RestaurantApp from './pages/RestaurantApp';
import './App.css';

type AppMode = 'landing' | 'customer' | 'restaurant';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('landing');

  const handleModeSelect = (mode: 'customer' | 'restaurant') => {
    setCurrentMode(mode);
  };

  const handleBackToLanding = () => {
    setCurrentMode('landing');
  };

  if (currentMode === 'landing') {
    return <LandingPage onSelectMode={handleModeSelect} />;
  }

  if (currentMode === 'customer') {
    return <CustomerApp onBack={handleBackToLanding} />;
  }

  if (currentMode === 'restaurant') {
    return <RestaurantApp onBack={handleBackToLanding} />;
  }

  return null;
}

export default App;