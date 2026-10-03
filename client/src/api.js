import axios from 'axios';

// Use environment variable if set (e.g. VITE_API_URL=https://mybackend.vercel.app),
// otherwise default to empty string for same-origin (/api/...) or Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
export { API_BASE_URL };
