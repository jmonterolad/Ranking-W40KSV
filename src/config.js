// src/config.js

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isLocal 
    ? 'http://127.0.0.1:8000' 
    : 'https://rankingw40ksvbackend.vercel.app';

console.log(`🚀 Conectado al Sector: ${isLocal ? 'LOCAL_COMMAND' : 'PRODUCCION_HUB'}`);