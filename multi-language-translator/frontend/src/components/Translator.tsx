import React, { useState, useEffect } from 'react';
import { translationAPI } from '../services/api';
import speechService from '../services/speechService';

interface Language {
  code: string;
  name: string;
}

const Translator: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await translationAPI.getLanguages();
      setLanguages(response.data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    try {
      let detectedSourceLang = sourceLang;
      
      // Auto-detect language if needed
      if (sourceLang === 'auto') {
        const detectResponse = await translationAPI.detectLanguage(sourceText);
        detectedSourceLang = detectResponse.data.language;
      }

      const response = await translationAPI.translate({
        text: sourceText,
        sourceLang: detectedSourceLang,
        targetLang
      });

      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeechToText = async () => {
    if (!speechService.isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(true);
    try {
      const transcript = await speechService.startListening(sourceLang === 'auto' ? 'en' : sourceLang);
      setSourceText(transcript);
    } catch (error) {
      console.error('Speech recognition error:', error);
      alert('Speech recognition failed. Please try again.');
    } finally {
      setIsListening(false);
    }
  };

  const handleTextToSpeech = async (text: string, language: string) => {
    if (!speechService.isSpeechSynthesisSupported()) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    setIsSpeaking(true);
    try {
      await speechService.speak(text, language);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      alert('Text-to-speech failed. Please try again.');
    } finally {
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy text');
    });
  };

  const swapLanguages = () => {
    if (sourceLang === 'auto') return;
    
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const clearText = () => {
    setSourceText('');
    setTranslatedText('');
  };

  return (
    <div className="translator">
      <div className="translator-header">
        <h1>Multi-Language Translator</h1>
        <p>Translate text between multiple languages with speech support</p>
      </div>

      <div className="language-selector">
        <div className="language-group">
          <label>From:</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            <option value="auto">Auto-detect</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <button 
          className="swap-btn" 
          onClick={swapLanguages}
          disabled={sourceLang === 'auto'}
          title="Swap languages"
        >
          ⇄
        </button>

        <div className="language-group">
          <label>To:</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="translation-area">
        <div className="input-section">
          <div className="text-area-header">
            <span>Source Text</span>
            <div className="text-controls">
              {speechService.isSpeechRecognitionSupported() && (
                <button
                  onClick={handleSpeechToText}
                  disabled={isListening}
                  className="speech-btn"
                  title="Speech to text"
                >
                  {isListening ? '🎤 Listening...' : '🎤'}
                </button>
              )}
              <button onClick={clearText} className="clear-btn" title="Clear text">
                🗑️
              </button>
            </div>
          </div>
          
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="text-input"
            rows={6}
          />
          
          <div className="input-actions">
            <span className="char-count">{sourceText.length} characters</span>
            <button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="translate-btn"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        <div className="output-section">
          <div className="text-area-header">
            <span>Translation</span>
            <div className="text-controls">
              {speechService.isSpeechSynthesisSupported() && translatedText && (
                <button
                  onClick={() => handleTextToSpeech(translatedText, targetLang)}
                  disabled={isSpeaking}
                  className="speech-btn"
                  title="Text to speech"
                >
                  {isSpeaking ? '🔊 Speaking...' : '🔊'}
                </button>
              )}
              {translatedText && (
                <button
                  onClick={() => copyToClipboard(translatedText)}
                  className="copy-btn"
                  title="Copy translation"
                >
                  📋
                </button>
              )}
            </div>
          </div>
          
          <textarea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="text-output"
            rows={6}
          />
        </div>
      </div>

      <div className="features-info">
        <div className="feature">
          <span className="feature-icon">🎤</span>
          <span>Speech-to-Text</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔊</span>
          <span>Text-to-Speech</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔄</span>
          <span>Auto-detect Language</span>
        </div>
        <div className="feature">
          <span className="feature-icon">📋</span>
          <span>Copy Translation</span>
        </div>
      </div>
    </div>
  );
};

export default Translator;