import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const translationAPI = {
  translate: (data: { text: string; sourceLang: string; targetLang: string }) =>
    api.post('/translate', data),
  
  detectLanguage: (text: string) =>
    api.post('/detect-language', { text }),
  
  getLanguages: () =>
    api.get('/languages'),
  
  getHistory: () =>
    api.get('/history'),
};

export default api;