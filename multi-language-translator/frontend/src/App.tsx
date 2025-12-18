import React, { useState } from 'react';
import Translator from './components/Translator';
import TranslationHistory from './components/TranslationHistory';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'history'>('translator');

  return (
    <div className="App">
      <nav className="app-nav">
        <button 
          className={activeTab === 'translator' ? 'active' : ''}
          onClick={() => setActiveTab('translator')}
        >
          Translator
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'translator' && <Translator />}
        {activeTab === 'history' && <TranslationHistory />}
      </main>
    </div>
  );
}

export default App;