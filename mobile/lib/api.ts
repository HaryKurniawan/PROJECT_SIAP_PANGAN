import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator localhost is 10.0.2.2
const API_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api');
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || 'spb-api-key-2026-s3cur3-k3y';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In React Native Expo, navigation should be handled via Expo Router.
    // We will handle 401s in a global wrapper or hook instead of window.location
    return Promise.reject(error);
  }
);

export default api;
