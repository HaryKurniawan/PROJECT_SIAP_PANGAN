import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  withCredentials: true,
  timeout: 10000, // Berhenti jika 10 detik tidak ada respon
});

console.log('📱 Connecting to API at:', API_URL);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In React Native Expo, navigation should be handled via Expo Router.
    // We will handle 401s in a global wrapper or hook instead of window.location
    return Promise.reject(error);
  }
);

export default api;
