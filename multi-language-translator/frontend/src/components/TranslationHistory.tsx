import React, { useState, useEffect } from 'react';
import { translationAPI } from '../services/api';

interface Translation {
  _id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

const TranslationHistory: React.FC = () => {
  const [history, setHistory] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await translationAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy text');
    });
  };

  const getLanguageName = (code: string) => {
    const langMap: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      'te': 'Telugu',
      'ta': 'Tamil',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'bn': 'Bengali',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese'
    };
    
    return langMap[code] || code.toUpperCase();
  };

  if (isLoading) {
    return <div className="loading">Loading translation history...</div>;
  }

  return (
    <div className="translation-history">
      <h2>Translation History</h2>
      
      {history.length === 0 ? (
        <div className="empty-history">
          <p>No translations yet. Start translating to see your history here!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((translation) => (
            <div key={translation._id} className="history-item">
              <div className="translation-pair">
                <div className="source-section">
                  <div className="language-label">
                    {getLanguageName(translation.sourceLang)}
                  </div>
                  <div className="text-content">
                    {translation.sourceText}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(translation.sourceText)}
                    className="copy-btn-small"
                    title="Copy source text"
                  >
                    📋
                  </button>
                </div>
                
                <div className="arrow">→</div>
                
                <div className="target-section">
                  <div className="language-label">
                    {getLanguageName(translation.targetLang)}
                  </div>
                  <div className="text-content">
                    {translation.translatedText}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(translation.translatedText)}
                    className="copy-btn-small"
                    title="Copy translation"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div className="timestamp">
                {new Date(translation.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;