# Multi-Language Text Translator

A comprehensive text translation application supporting multiple languages with speech-to-text and text-to-speech capabilities.

## Features

- **Translation Features:**
  - Translate between 16+ languages
  - Auto-detect source language
  - Support for Indian languages (Hindi, Telugu, Tamil, Malayalam, Kannada, Bengali)
  - International languages (English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese)

- **Speech Features:**
  - Speech-to-text input (Web Speech API)
  - Text-to-speech output (Speech Synthesis API)
  - Language-specific voice support

- **User Experience:**
  - Clean and intuitive interface
  - Copy translated text to clipboard
  - Swap source and target languages
  - Translation history storage
  - Character count display
  - Responsive design

## Tech Stack

**Frontend:**
- React.js with TypeScript
- Web Speech API for speech recognition
- Speech Synthesis API for text-to-speech
- Axios for API calls

**Backend:**
- Node.js + Express
- MongoDB for translation history
- LibreTranslate API for translations
- Language detection algorithms

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
MONGODB_URI=mongodb://localhost:27017/translator
PORT=5000
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

## Supported Languages

| Language | Code | Native Script Support |
|----------|------|----------------------|
| English | en | ✓ |
| Hindi | hi | ✓ (Devanagari) |
| Telugu | te | ✓ (Telugu script) |
| Tamil | ta | ✓ (Tamil script) |
| Malayalam | ml | ✓ (Malayalam script) |
| Kannada | kn | ✓ (Kannada script) |
| Bengali | bn | ✓ (Bengali script) |
| Spanish | es | ✓ |
| French | fr | ✓ |
| German | de | ✓ |
| Italian | it | ✓ |
| Portuguese | pt | ✓ |
| Russian | ru | ✓ (Cyrillic) |
| Japanese | ja | ✓ (Hiragana/Katakana/Kanji) |
| Korean | ko | ✓ (Hangul) |
| Chinese | zh | ✓ (Simplified) |

## API Endpoints

- `POST /api/translate` - Translate text
- `POST /api/detect-language` - Auto-detect language
- `GET /api/languages` - Get supported languages
- `GET /api/history` - Get translation history

## Speech Features

### Speech-to-Text
- Uses Web Speech API
- Supports multiple languages
- Real-time transcription
- Browser compatibility check

### Text-to-Speech
- Uses Speech Synthesis API
- Language-specific voices
- Playback controls
- Voice selection options

## Usage

1. **Basic Translation:**
   - Enter text in the source text area
   - Select source and target languages
   - Click "Translate" button

2. **Auto-detect Language:**
   - Set source language to "Auto-detect"
   - System will identify the language automatically

3. **Speech Input:**
   - Click the microphone button
   - Speak clearly in the selected language
   - Text will be transcribed automatically

4. **Speech Output:**
   - Click the speaker button on translated text
   - Listen to the pronunciation

5. **Copy Translation:**
   - Click the clipboard button to copy text
   - Paste anywhere you need

6. **View History:**
   - Switch to "History" tab
   - View all previous translations
   - Copy any previous translation

## Language Detection

The system uses pattern matching for Indian languages:
- **Hindi:** Devanagari script (U+0900-U+097F)
- **Telugu:** Telugu script (U+0C00-U+0C7F)
- **Tamil:** Tamil script (U+0B80-U+0BFF)
- **Malayalam:** Malayalam script (U+0D00-U+0D7F)
- **Kannada:** Kannada script (U+0C80-U+0CFF)
- **Bengali:** Bengali script (U+0980-U+09FF)

## Browser Compatibility

### Speech Recognition:
- Chrome/Chromium browsers
- Edge (Chromium-based)
- Safari (limited support)

### Speech Synthesis:
- All modern browsers
- Chrome, Firefox, Safari, Edge

## Project Structure

```
multi-language-translator/
├── backend/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Translator.tsx
    │   │   └── TranslationHistory.tsx
    │   ├── services/
    │   │   ├── api.ts
    │   │   └── speechService.ts
    │   └── App.tsx
    └── public/
```

## Future Enhancements

- Offline translation support
- Document translation
- Image text extraction and translation
- Voice conversation mode
- Translation accuracy improvements
- More language support