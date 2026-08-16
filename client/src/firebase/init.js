/**
 * Firebase Initialization Module
 * Initializes Firebase App, Firestore, Auth, and other services
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig, isFirebaseConfigured } from './config';

let app = null;
let db = null;
let auth = null;
let analytics = null;

const isDevelopment = import.meta.env.DEV;
const useEmulator = isDevelopment && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

export function initializeFirebase() {
  if (app) return { app, db, auth, analytics };

  try {
    if (!isFirebaseConfigured()) {
      throw new Error(
        'Firebase not configured. Please add your Firebase credentials to .env file:\n' +
        'VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, etc.'
      );
    }

    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    console.log('✓ Firebase App initialized');

    // Initialize Firestore
    db = getFirestore(app);
    
    if (useEmulator) {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('✓ Connected to Firestore Emulator');
      } catch (error) {
        console.warn('Firestore Emulator not available:', error.message);
      }
    }
    console.log('✓ Firestore initialized');

    // Initialize Authentication
    auth = getAuth(app);
    
    if (useEmulator) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        console.log('✓ Connected to Auth Emulator');
      } catch (error) {
        console.warn('Auth Emulator not available:', error.message);
      }
    }
    console.log('✓ Authentication initialized');

    // Initialize Analytics (optional)
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
      console.log('✓ Google Analytics initialized');
    }

    console.log('✓ All Firebase services initialized successfully');
    return { app, db, auth, analytics };
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
}

export function getFirebaseServices() {
  if (!app) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return { app, db, auth, analytics };
}

export { db, auth, app, analytics };
