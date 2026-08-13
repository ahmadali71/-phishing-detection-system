import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Initialize Firebase
import { initializeFirebase } from './firebase/init';

try {
  initializeFirebase();
  console.log('Firebase initialized at app startup');
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
  console.log('App will continue with localStorage-only mode');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
