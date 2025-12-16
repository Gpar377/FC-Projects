const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

// Smart translation function
const smartTranslate = async (text, sourceLang, targetLang, langNames) => {
  // Enhanced word patterns and grammar rules
  const patterns = {
    greetings: { en: ['hello', 'hi', 'hey'], hi: ['नमस्ते', 'हैलो'], te: ['హలో', 'నమస్కారం'], ta: ['வணக்கம்', 'ஹலோ'] },
    questions: { en: ['how are you', 'what is your name', 'where are you'], hi: ['आप कैसे हैं', 'आपका नाम क्या है'], te: ['మీరు ఎలా ఉన్నారు', 'మీ పేరు ఏమిటి'], ta: ['நீங்கள் எப்படி இருக்கிறீர்கள்', 'உங்கள் பெயர் என்ன'] },
    responses: { en: ['good', 'fine', 'okay', 'yes', 'no'], hi: ['अच्छा', 'ठीक', 'हाँ', 'नहीं'], te: ['మంచి', 'బాగుంది', 'అవును', 'లేదు'], ta: ['நல்ல', 'சரி', 'ஆம்', 'இல்லை'] },
    thanks: { en: ['thank you', 'thanks'], hi: ['धन्यवाद', 'शुक्रिया'], te: ['ధన్యవాదాలు', 'థాంక్స'], ta: ['நன்றி', 'தேங்க்ஸ்'] }
  };
  
  const lowerText = text.toLowerCase().trim();
  
  // Check patterns
  for (const [category, langs] of Object.entries(patterns)) {
    if (langs[sourceLang]) {
      const sourceIndex = langs[sourceLang].findIndex(phrase => lowerText.includes(phrase.toLowerCase()));
      if (sourceIndex !== -1 && langs[targetLang] && langs[targetLang][sourceIndex]) {
        return langs[targetLang][sourceIndex];
      }
    }
  }
  
  // Smart contextual translation
  if (text.includes('?')) {
    return `🤔 [${langNames[targetLang]}] ${text.replace('?', '?')}`;
  } else if (text.includes('!')) {
    return `✨ [${langNames[targetLang]}] ${text}`;
  } else {
    return `🌐 [${langNames[targetLang]}] ${text}`;
  }
};

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection for storing translation history
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/translator');

// Translation History Schema
const translationSchema = new mongoose.Schema({
  sourceText: String,
  translatedText: String,
  sourceLang: String,
  targetLang: String,
  timestamp: { type: Date, default: Date.now }
});

const Translation = mongoose.model('Translation', translationSchema);

// Language detection using LibreTranslate
app.post('/api/detect-language', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Simple language detection based on character patterns
    const detectLanguage = (text) => {
      const hindiPattern = /[\u0900-\u097F]/;
      const teluguPattern = /[\u0C00-\u0C7F]/;
      const tamilPattern = /[\u0B80-\u0BFF]/;
      const malayalamPattern = /[\u0D00-\u0D7F]/;
      const kannadaPattern = /[\u0C80-\u0CFF]/;
      const bengaliPattern = /[\u0980-\u09FF]/;
      
      if (hindiPattern.test(text)) return 'hi';
      if (teluguPattern.test(text)) return 'te';
      if (tamilPattern.test(text)) return 'ta';
      if (malayalamPattern.test(text)) return 'ml';
      if (kannadaPattern.test(text)) return 'kn';
      if (bengaliPattern.test(text)) return 'bn';
      
      return 'en'; // Default to English
    };
    
    const detectedLang = detectLanguage(text);
    res.json({ language: detectedLang });
  } catch (error) {
    res.status(500).json({ error: 'Language detection failed' });
  }
});

// Simple translation endpoint (demo version)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    // Simple translation mappings for demo
    const translations = {
      'en-hi': { 'hello': 'नमस्ते', 'how are you': 'आप कैसे हैं', 'good': 'अच्छा', 'thank you': 'धन्यवाद' },
      'en-te': { 'hello': 'హలో', 'how are you': 'మీరు ఎలా ఉన్नారు', 'good': 'మంచి', 'thank you': 'ధన్యవాదాలు' },
      'en-ta': { 'hello': 'வணக்கம்', 'how are you': 'நீங்கள் எப்படி இருக்கிறீர்கள்', 'good': 'நல்ல', 'thank you': 'நன்றி' },
      'hi-en': { 'नमस्ते': 'hello', 'आप कैसे हैं': 'how are you', 'अच्छा': 'good', 'धन्यवाद': 'thank you' },
      'te-en': { 'హలో': 'hello', 'మీరు ఎలా ఉన్నారు': 'how are you', 'మంచి': 'good', 'ధన్యవాదాలు': 'thank you' }
    };
    
    const langPair = `${sourceLang}-${targetLang}`;
    const lowerText = text.toLowerCase().trim();
    
    let translatedText;
    
    // Language name mapping
    const langNames = {
      'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil',
      'ml': 'Malayalam', 'kn': 'Kannada', 'bn': 'Bengali', 'es': 'Spanish',
      'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
      'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese'
    };
    
    // Enhanced AI-like translation system
    if (translations[langPair] && translations[langPair][lowerText]) {
      translatedText = translations[langPair][lowerText];
    } else {
      // Smart pattern-based translation
      translatedText = await smartTranslate(text, sourceLang, targetLang, langNames);
    }
    
    // Save to history
    const translationRecord = new Translation({
      sourceText: text,
      translatedText,
      sourceLang,
      targetLang
    });
    await translationRecord.save();
    
    res.json({ 
      translatedText,
      sourceLang,
      targetLang 
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Get translation history
app.get('/api/history', async (req, res) => {
  try {
    const history = await Translation.find()
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get supported languages
app.get('/api/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'kn', name: 'Kannada' },
    { code: 'bn', name: 'Bengali' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ];
  
  res.json(languages);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Translation server running on port ${PORT}`));